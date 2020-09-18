import React from 'react';
import { View, Text, StyleSheet, Button, Picker, Switch, ScrollView, Modal, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable'; 

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

    confirmReservation() {

    }

    handleReservation() {
        console.log(JSON.stringify(this.state));

        // this.toggleModal(); // will toggle it on - we'll cause the modal to appear with the submitted data
        // now instead of that we have:
        Alert.alert(
            'Reservation Confirmation',
`Number of Guests: ${this.state.guests}
Smoking: ${this.state.smoking} 
Date and Time: ${this.state.date}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => this.resetForm()
                }
            ],
            { cancelable: false }
        )
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',

            showModal: false // this is not necessary on iOS, but I'll leave it for safety - cause I haven't tested the app on Android, 
        });
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