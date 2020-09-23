import React from 'react';
import { View, Text, StyleSheet, Button, Picker, Switch, ScrollView, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions'; //  We need Permissions from the device platform in order to access the Notification Bar. So we will first ask for Permissions to access the Notification Bar and then after that we will be able to put the Notifications.
import * as Calendar from 'expo-calendar';

class Reservation extends React.Component {
    constructor(props) {
        super(props);

        this.state = { // we'll store state locally for Reservation for now
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

        let message = `Number of Guests: ${this.state.guests} \nSmoking: ${this.state.smoking} \nDate and Time: ${this.state.date}`;
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
                        this.resetForm();
                    }
                }
            ],
            { cancelable: false }
        );


        this.addReservationToCalendar(this.state.date); 
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',

            showModal: false // this is not necessary on iOS, but I'll leave it for safety - cause I haven't tested the app on Android, 
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS); // await for permission to be obtained asynchronously, and when that happens, ask for Permissions.USER_FACING_NOTIFICATIONS. So that's what we are trying to create in this application, User Facing Notifications. If we don't get it, then, we won't be able to create the Notification. 
        if (permission.status !== 'granted') { // this permission object will contain a status property which should be granted or not granted. So when the permission is returned, we'll check if the status is granted. if not, then I will ask for permission again: 
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS); // So I'm trying to ask for the same permission two times. the first time we're checking if the Permission ALREADY EXISTS for us. If it is granted, then it's okay. Otherwise, we'll ASK THE USER for the permission, and if that is granted, then we can proceed forward
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notification');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission(); // so if it's with permission.status !== 'granted', it'll somwhow automatically stop presentLocalNotification()?

        let formattedDate = new Intl.DateTimeFormat(
            'en-US', 
            { 
                month: 'short', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }
        ).format(new Date(Date.parse(date))); 

        Notifications.presentNotificationAsync({ // inside here we will configure the Local Notification to be presented
        // NOTE: Muppala had here presentLocalNotificationAsync(), and it didn't work! I found out that it doesn't exist anymore, and instead we have presentNotificationAsync() - but even it has been deprecated now: https://docs.expo.io/versions/v38.0.0/sdk/notifications/#presentnotificationasynccontent-notificationcontentinput-identifier-string-promisestring
        // so don't spend too much time on this stuff - a lot of it might be deprecated already!
            title: 'Your Reservation',
            body: 'Requested reservation for ' + formattedDate, // message to user
            // we can also configure a few things:
            ios: {
                sound: true
            },
            android: {
                sound: true,
                // android also allows additional configuration (see pop-ups):
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
    async obtainCalendarPermission2() {
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
        await this.obtainCalendarPermission();
        await this.obtainCalendarPermission2();

        const defaultCalendar = 
        Calendar.createEventAsync(
            (await Calendar.getDefaultCalendarAsync()).id, // this is the syntax that popped up automatically when I tried typing here "Calendar.getDefaultCalendarAsync().id"! Got the idea for trying to access id here from the description of Calendar.getDefaultCalendarAsync() and https://docs.expo.io/versions/latest/sdk/calendar/?redirected#calendar. but they say it's iOS only - so to include Android I guess I gotta add some more code in here! Muppala had Calendar.DEFAULT - but it doesn't exist anymore! So for Android gotta find some other way!
            { // details
                title:  'Con Fusion Table Reservation',
                startDate: new Date(Date.parse(date)), // convert the Date ISO string into a Date object
                endDate: new Date(Date.parse(date) + 2*60*60*1000), // we want to add 2 hours - but we gotta write it in milliseconds. 1 hour = 60 min = 60*60 sec = 3600 sec = 3600*1000 msec
                // startDate: new Date(Date.parse(date)), // convert the Date ISO string into a Date object
                // endDate: new Date(Date.parse(date) + 2*60*60*1000), // we want to add 2 hours - but we gotta write it in milliseconds. 1 hour = 60 min = 60*60 sec = 3600 sec = 3600*1000 msec
                timeZone: 'Asia/Hong_Kong',
                location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
            }
        ); 
    }

    render() {
        return (
            <ScrollView>

                <Animatable.View animation='zoomInUp' duration={500}>

                    <View style={styles.formRow}>{/*  there is no concept of form as such in mobile UI - So we just synthesize that using the Different UI widgets (ex we'll use Text as a Label, Picker as an Input, etc.). And we'll just apply our custom styles to make it look like a form. Ex this View will act a formRow. It will enclose a formLabel (with flex 2) and a formItem (with flex 1). And we style formRow with flexDirection: 'row' - so its contents (formLabel and formItem) will be laid out horizontally */}
                        <Text style={styles.formLabel}>Number of Guests</Text>{/* this is how I synthesize a label */}
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
                            onTintColor='#512DA8'// background color
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
                            mode='datetime'// both date and time
                            placeholder='Select date and time'
                            minDate='2017-01-01'// We can configure this programmatically to show the minimum date to be today's date, if you want to. I am not going to that level of detail. I will leave that as an extension exercise for you
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{ // (optional) we can specify some additional styles (see the docs) - ex a dateIcon which will be displayed inside a box created by the DatePicker and a dateInput:
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

const styles = StyleSheet.create({ // all the values in here I've figured out by trial and error, there's nothing sacred about these numbers. You can change the numbers and the values as is suited for you
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