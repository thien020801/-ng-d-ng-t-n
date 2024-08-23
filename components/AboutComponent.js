import React, { Component } from 'react';
import { Text, FlatList } from 'react-native';
import { Card, ListItem, Avatar } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

class RenderHistory extends Component {
  render() {

    if (this.props.isLoading) {
      return (
        <Card>
          <Card.Title>Điều Hành Doanh Nghiệp</Card.Title>
          <Card.Divider />
          <Loading />
        </Card>
      );
    } else if (this.props.errMess) {
      return (
        <Card>
          <Card.Title>Điều Hành Doanh Nghiệp</Card.Title>
          <Card.Divider />
          <Text>{this.props.errMess}</Text>
        </Card>
      );
    } else {

    return (
      <Card>
  <Card.Title>Lịch sử của chúng tôi</Card.Title>
  <Card.Divider />
  <Text style={{ margin: 10 }}>Bắt đầu từ năm 2010, Ristorante con Fusion nhanh chóng khẳng định vị thế của mình là một biểu tượng ẩm thực xuất sắc tại Hồng Kông. Với dòng ẩm thực kết hợp văn hóa độc đáo, không thể tìm thấy ở bất kỳ nơi nào khác, nhà hàng thu hút sự ủng hộ từ khách hàng danh tiếng nhất tại Hồng Kông. Với sự góp mặt của bốn đầu bếp ba sao Michelin hàng đầu thế giới, bạn không bao giờ biết món gì sẽ xuất hiện trên đĩa của bạn khi bạn đến thăm chúng tôi lần sau.</Text>
  <Text style={{ margin: 10 }}>Nhà hàng bắt đầu từ những ngày đầu khi The Frying Pan, một chuỗi nhà hàng thành công do CEO chúng tôi, ông Tom, sáng lập, lần đầu tiên giới thiệu những món ăn tốt nhất thế giới trong một cái chảo.</Text>
</Card>
    );
    }
  }
}

class RenderLeadership extends Component {
  render() {
    return (
      <Card>
        <Card.Title>Điều Hành Doanh Nghiệp</Card.Title>
        <Card.Divider />
        <FlatList data={this.props.leaders}
          renderItem={({ item, index }) => this.renderLeaderItem(item, index)}
          keyExtractor={(item) => item.id.toString()} />
      </Card>
    );
  }
  renderLeaderItem(item, index) {
    return (
      <ListItem key={index}>
        <Avatar rounded source={{ uri: baseUrl + item.image }} />
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: 'bold' }}>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  }
}

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
  return {
    leaders: state.leaders
  }
};

class About extends Component {
  constructor(props) {
    super(props);
   
  }
  render() {
    return (
      <ScrollView>
        <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
        <RenderHistory />
        </Animatable.View>
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
        <RenderLeadership
      leaders={this.props.leaders.leaders}
      isLoading={this.props.leaders.isLoading}
      errMess={this.props.leaders.errMess} />
      </Animatable.View>
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps)(About);