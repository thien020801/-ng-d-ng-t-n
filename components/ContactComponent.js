import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';

class Contact extends Component {
  render() {
    return (
      <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
      <Card>
        <Card.Title>Thông Tin liên lạc</Card.Title>
        <Card.Divider />
        <Text style={{ margin: 10 }}>đường Quang Trung</Text>
        <Text style={{ margin: 10 }}>Quận 12</Text>
        <Text style={{ margin: 10 }}>Tp Hồ Chí Minh</Text>
        <Text style={{ margin: 10 }}>Tel: +852 1234 5678</Text>
        <Text style={{ margin: 10 }}>Fax: +852 8765 4321</Text>
        <Text style={{ margin: 10 }}>Email: odaycoga@food.net</Text>
        <Button title=' Compose Email' buttonStyle={{ backgroundColor: '#990000' }}
            icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
            onPress={this.composeMail} />
      </Card>
      </Animatable.View>
    );
  }
  composeMail() {
    MailComposer.composeAsync({
      recipients: ['hoangthien28241@gmail.com'],
      subject: 'From Confusion',
      body: 'Hello my friends ...'
    });
  }
}
export default Contact;