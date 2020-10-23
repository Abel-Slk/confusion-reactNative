import React from 'react';
import { View, Text, StyleSheet, Button, Picker, Switch, ScrollView, Alert, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions'; 
import * as Calendar from 'expo-calendar';

class Reservation extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table'
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));

        const smoking = this.state.smoking ? 'Yes' : 'No';
        let message = `Number of Guests: ${this.state.guests} \nSmoking: ${smoking} \nDate and Time: ${this.state.date}`;
        Alert.alert(
            'Reservation Confirmation',
            message,
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        this.presentLocalNotification(this.state.date);
                        this.addReservationToCalendar(this.state.date); 
                        this.resetForm();
                    }
                }
            ],
            { cancelable: false }
        );
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',

            showModal: false 
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS); 
        if (permission.status !== 'granted') { 
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS); 
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notification');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission(); 

        let formattedDate = new Intl.DateTimeFormat(
            'en-US', 
            { 
                month: 'short', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }
        ).format(new Date(Date.parse(date))); 

        Notifications.presentNotificationAsync({ 
            title: 'Your Reservation',
            body: 'Requested reservation for ' + formattedDate, 
            ios: {
                sound: true
            },
            android: {
                sound: true,
                // android also allows additional configuration:
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR); 
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission for Calendar not granted');
            }
        }
        return permission;
    }
    // On iOS also need to get permission for reminders:
    async obtainRemindersPermission() { 
        let permission = await Permissions.getAsync(Permissions.REMINDERS); 
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.REMINDERS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission for Reminders not granted');
            }
        }
        return permission;
    }

    async addReservationToCalendar(date) {
        if (Platform.OS === 'ios') {
            await this.obtainCalendarPermission();
            await this.obtainRemindersPermission();
        }
        else {
            await this.obtainCalendarPermission();
        }

        await Calendar.createEventAsync(
            (await Calendar.getDefaultCalendarAsync()).id, // this is the syntax that popped up automatically when I tried typing here "Calendar.getDefaultCalendarAsync().id"! Got the idea for trying to access id here from the description of Calendar.getDefaultCalendarAsync() and https://docs.expo.io/versions/latest/sdk/calendar/?redirected#calendar
            { 
                title:  'Con Fusion Table Reservation',
                startDate: new Date(Date.parse(date)), // convert the Date ISO string into a Date object
                endDate: new Date(Date.parse(date) + 2*60*60*1000), // we want to add 2 hours - but we gotta write it in milliseconds. 1 hour = 60 min = 60*60 sec = 3600 sec = 3600*1000 msec
                timeZone: 'Asia/Hong_Kong',
                location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
            }
        ); 
    }

    render() {
        return (
            <ScrollView>

                <Animatable.View animation='zoomInUp' duration={500}>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>{/* synthesizing a label */}
                        <Picker 
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}
                        >
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                        </Picker>
                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor='#512DA8'
                            onValueChange={value => this.setState({ smoking: value })}// value will be received as either true or false 
                        >
                        </Switch>
                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker
                            style={{ flex: 2, marginRight: 20 }}
                            date={this.state.date}
                            format=''
                            mode='datetime'
                            placeholder='Select date and time'
                            minDate='2017-01-01'
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{ 
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={date => this.setState({ date: date })}
                        >
                        </DatePicker>
                    </View>

                    <View style={styles.formRow}>
                        <Button 
                            title='Reserve'
                            color='#512DA8'
                            onPress={() => this.handleReservation()}
                            accessibilityLabel='Learn more about this purple button'
                        />
                    </View>

                </Animatable.View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({ 
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;