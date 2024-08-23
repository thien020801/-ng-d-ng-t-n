import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Switch, Button, Alert, TextInput } from 'react-native';
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
      selectedChicken: 'Gà nướng muối ớt',
      date: new Date(),
      showDatePicker: false,
      showCustomGuestsInput: false,
      customGuests: '',
    };
  }

  render() {
    const { guests, showCustomGuestsInput, customGuests } = this.state;
    const showTextInput = guests === 7 && showCustomGuestsInput;
  
    return (
      <Animatable.View animation='zoomIn' duration={2000}>
        <ScrollView>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Số lượng gà muốn đặt</Text>
            {guests !== 7 ? (
              <Picker
                style={styles.formItem}
                selectedValue={guests}
                onValueChange={(value) => this.setState({ guests: value })}
              >
                <Picker.Item label='1' value={1} />
                <Picker.Item label='2' value={2} />
                <Picker.Item label='3' value={3} />
                <Picker.Item label='4' value={4} />
                <Picker.Item label='5' value={5} />
                <Picker.Item label='6' value={6} />
                <Picker.Item label='Số khác' value={7} />
              </Picker>
            ) : (
              <View style={styles.customGuestsContainer}>
                {showTextInput ? (
                  <TextInput
                    style={styles.customGuestsInput}
                    value={customGuests}
                    onChangeText={(text) => this.setState({ customGuests: text })}
                    keyboardType='numeric'
                    onBlur={() => this.setState({ showCustomGuestsInput: false })}
                  />
                ) : (
                  <Text
                    style={styles.customGuestsText}
                    onPress={() => this.setState({ showCustomGuestsInput: true })}
                  >
                    {customGuests ? customGuests : 'Nhập số lượng'}
                  </Text>
                )}
              </View>
            )}
          </View>
  
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Chọn món gà</Text>
            <Picker
              style={{ ...styles.formItem1, width: '70%' }}
              selectedValue={this.state.selectedChicken}
              onValueChange={(value) => this.setState({ selectedChicken: value })}
            >
              <Picker.Item label='Gà nướng muối ớt' value='Gà nướng muối ớt' style={{ flex: 1 }} />
              <Picker.Item label='Gà kho gừng' value='Gà kho gừng' style={{ flex: 1 }} />
              <Picker.Item label='Gà chiên giòn' value='Gà chiên giòn' style={{ flex: 1 }} />
              <Picker.Item label='Canh gà hầm thuốc bắc' value='Canh gà hầm thuốc bắc' style={{ flex: 1 }} />
            </Picker>

          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Ngày và giờ</Text>
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
            <Button title='Đặt món gà' color='#7cc' onPress={this.handleReservation} />
          </View>
        </ScrollView>
      </Animatable.View>
    );
  }

  handleReservation = () => {
    const { guests, selectedChicken, date, customGuests } = this.state;
    const numGuests = guests !== 7 ? guests : parseInt(customGuests);
    Alert.alert(
      'Xác nhận đặt gà',
      'Số lượng gà: ' + numGuests + '\nMón gà: ' + selectedChicken + '\nNgày và giờ: ' + date.toISOString(),
      [
        { text: 'Hủy', onPress: this.resetForm },
        {
          text: 'OK',
          onPress: () => {
            this.addReservationToCalendar(date);
            this.presentLocalNotification(date);
            this.resetForm();
          }
        },
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
        title: 'Xác nhận đặt gà',
      startDate: date,
      endDate: new Date(date.getTime() + 2 * 60 * 60 * 1000),
      timeZone: 'Asia/Ho_Chi_Minh', // Sửa thành múi giờ của Việt Nam
      location: 'Quận 12, TP. Hồ Chí Minh' // Sửa thành địa chỉ ở Quận 12, TP. Hồ Chí Minh
      });
      alert('Mã sự kiện mới của bạn là: ' + eventId);
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
          title: 'Đặt bàn của bạn',
          body: 'Yêu cầu đặt bàn ngày ' + format(date, 'dd/MM/yyyy HH:mm'),
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
      selectedChicken: 'Gà nướng muối ớt',
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
  formItem1: { flex: 0 },
  customGuestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  customGuestsText: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'underline',
    marginRight: 10,
  },
  customGuestsInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
});

export default Reservation;
