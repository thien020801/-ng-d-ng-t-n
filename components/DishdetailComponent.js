import React, { Component } from 'react';
import { View, Text, FlatList, Modal, Button, PanResponder, Alert } from 'react-native';
import { Card, Image, Icon, Input, Rating } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';
import { SliderBox } from 'react-native-image-slider-box';

import * as Animatable from 'react-native-animatable';

class RenderSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 30,
      height: 0
    };
  }
  render() {
    const images = [
      baseUrl + this.props.dish.image,
      
    ];
    return (
      <Card onLayout={this.onLayout}>
        <SliderBox images={images} parentWidth={this.state.width - 30} />
        
      </Card>
    );
  }
  onLayout = (evt) => {
    this.setState({
      width: evt.nativeEvent.layout.width,
      height: evt.nativeEvent.layout.height,
    });
  };
}

class RenderDish extends Component {
  render() {
    // gesture
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if (dx < -200) return 1; // right to left
      return 0;
    };

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
      if (dx > 200) return true; // left to right
      return false;
    };

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => { return true; },
      onPanResponderEnd: (e, gestureState) => {
        if (recognizeDrag(gestureState) === 1) {
          Alert.alert(
            'Add Favorite',
            'Are you sure you wish to add ' + dish.name + ' to favorite?',
            [
              { text: 'Cancel', onPress: () => { /* nothing */ } },
              { text: 'OK', onPress: () => { this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite() } },
            ]
          );
        } else if (recognizeComment(gestureState)) {
          this.props.onPressComment();
        }
        return true;
      }
    });

    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card {...panResponder.panHandlers}>
          
          <Card.Title>{dish.name}</Card.Title>
          <Card.Divider />
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Icon raised reverse name={this.props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
              onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite()} />
            <Icon raised reverse name='pencil' type='font-awesome' color='#f50'
              onPress={() => this.props.onPressComment()} />
          </View>
        </Card>
      );
    }
    return (<View />);
  }
}

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <Card.Divider />
        <FlatList data={comments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={(item) => item.id.toString()} />
      </Card>
    );
  }
  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        {/* <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text> */}
        <Rating startingValue={item.rating} imageSize={16} readonly style={{ flexDirection: 'row' }} />
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  };
}

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
};
import { postFavorite, postComment } from '../redux/ActionCreators';
const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 3,
      author: '',
      comment: ''
    };
  }
  render() {
    return (
      <View style={{ justifyContent: 'center', margin: 20 }}>
        <Rating startingValue={this.state.rating} showRating={true}
          onFinishRating={(value) => this.setState({ rating: value })} />
        <View style={{ height: 20 }} />
        <Input value={this.state.author} placeholder='Author' leftIcon={{ name: 'user-o', type: 'font-awesome' }}
          onChangeText={(text) => this.setState({ author: text })} />
        <Input value={this.state.comment} placeholder='Comment' leftIcon={{ name: 'comment-o', type: 'font-awesome' }}
          onChangeText={(text) => this.setState({ comment: text })} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button title='SUBMIT' color='#7cc'
            onPress={() => this.handleSubmit()} />
          <View style={{ width: 10 }} />
          <Button title='CANCEL' color='#7cc'
            onPress={() => this.props.onPressCancel()} />
        </View>
      </View>
    );
  }
  handleSubmit() {
    //alert(this.props.dishId + ':' + this.state.rating + ':' + this.state.author + ':' + this.state.comment);
    this.props.postComment(this.props.dishId, this.state.rating, this.state.author, this.state.comment);
    this.props.onPressCancel();
  }
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter((cmt) => cmt.dishId === dishId);
    const favorite = this.props.favorites.some((el) => el === dishId);

    return (
      <ScrollView>
        <Animatable.View animation='flipInY' duration={2000} delay={1000}>
          <RenderSlider dish={dish} />
        </Animatable.View>
        <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
          <RenderDish
            dish={this.props.dishes.dishes[dishId]}
            favorite={this.props.favorites.some((el) => el === dishId)}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={() => this.setState({ showModal: true })}
          />
        </Animatable.View>
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
          <RenderComments
            comments={this.props.comments.comments.filter(
              (comment) => comment.dishId === dishId
            )}
          />
        </Animatable.View>
        <Modal animationType={'slide'} visible={this.state.showModal} onRequestClose={() => this.setState({ showModal: false })}>
          <ModalContent dishId={dishId} onPressCancel={() => this.setState({ showModal: false })} postComment={this.props.postComment} />
        </Modal>
      </ScrollView>
    );
  }
  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
