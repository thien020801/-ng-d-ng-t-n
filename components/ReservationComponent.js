import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Switch, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import * as Animatable from 'react-native-animatable';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guests: 1,
      smoking: false,
      date: new Date(),
      showDatePicker: false,
    };
  }

  render() {
    return (
      <Animatable.View animation='zoomIn' duration={2000}> 
      <ScrollView>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Number of Guests</Text>
          <Picker
            style={styles.formItem}
            selectedValue={this.state.guests}
            onValueChange={(value) => this.setState({ guests: value })}
          >
            <Picker.Item label='1' value={1} />
            <Picker.Item label='2' value={2} />
            <Picker.Item label='3' value={3} />
            <Picker.Item label='4' value={4} />
            <Picker.Item label='5' value={5} />
            <Picker.Item label='6' value={6} />
          </Picker>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Smoking/No-Smoking?</Text>
          <Switch
            style={styles.formItem}
            value={this.state.smoking}
            onValueChange={(value) => this.setState({ smoking: value })}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Date and Time</Text>
          <Icon
            name='schedule'
            size={36}
            onPress={() => this.setState({ showDatePicker: true })}
          />
          <Text style={{ marginLeft: 10 }}>
            {format(this.state.date, 'dd/MM/yyyy - HH:mm')}
          </Text>
          <DateTimePickerModal
            mode='datetime'
            isVisible={this.state.showDatePicker}
            onConfirm={this.handleDateConfirm}
            onCancel={this.hideDatePicker}
          />
        </View>
        <View style={styles.formRow}>
          <Button title='Reserve' color='#7cc' onPress={this.handleReservation} />
        </View>
      </ScrollView>
      </Animatable.View> 
    );
  }

  handleReservation = () => {
    Alert.alert(
      'Your Reservation OK?',
      'Number of Guestes: ' + this.state.guests + '\nSmoking? ' + this.state.smoking + '\nDate and Time: ' + this.state.date.toISOString(),
      [
        { text: 'Cancel', onPress: this.resetForm },
        { text: 'OK', onPress: () => {
          this.addReservationToCalendar(this.state.date);
          this.presentLocalNotification(this.state.date);
          this.resetForm();
        }},
      ]
    );
  }
  async addReservationToCalendar(date) {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const defaultCalendarSource = { isLocalAccount: true, name: 'Expo Calendar' };
      const newCalendarID = await Calendar.createCalendarAsync({
        title: 'Expo Calendar',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'internalCalendarName',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
      const eventId = await Calendar.createEventAsync(newCalendarID, {
        title: 'Confusion Table Reservation',
        startDate: date,
        endDate: new Date(date.getTime() + 2 * 60 * 60 * 1000),
        timeZone: 'Asia/Hong_Kong',
        location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
      });
      alert('Your new event ID is: ' + eventId);
    }
  }
  async presentLocalNotification(date) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true })
      });
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Your Reservation',
          body: 'Reservation for ' + date + ' requested',
          sound: true,
          vibrate: true
        },
        trigger: null
      });
    }
  }

  resetForm = () => {
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date(),
      showDatePicker: false,
    });
  };

  handleDateConfirm = (date) => {
    this.setState({ date: date, showDatePicker: false });
  };

  hideDatePicker = () => {
    this.setState({ showDatePicker: false });
  };
}

const styles = StyleSheet.create({
  formRow: { alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row', margin: 20 },
  formLabel: { fontSize: 18, flex: 2 },
  formItem: { flex: 1 },
});

export default Reservation;
