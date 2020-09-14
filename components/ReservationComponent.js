import React from 'react';
import { View, Text, StyleSheet, Button, Picker, Switch, ScrollView, Modal } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

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

        this.toggleModal(); // will toggle it on - we'll cause the modal to appear with the submitted data
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

                {/* we'll print in a Modal what we have submitted in our form: */}
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.toggleModal(); this.resetForm(); }}// The onDismiss prop allows passing a function that will be called once the modal has been dismissed. (that is, if we click on the cross of the modal's window (React Native's Modal doesn't seem to have it) -- OR just whenever Modal's visible becomes false??? - React Native automatically recognizes that as dismissing the modal!! So can't have this.toggleModal() here like we had initially - that'll cause the modal to be toggled on again right AFTER being DISMISSED by clicking on the Close button!
                    // NOTE: initially we wanted to implement onDismiss, onRequestClose and the close button's onPress identically - do the same thing for different scenarios of closing (cross, hardware button, and visual button respectively) - but it turns out that they might be interdependent! Cause when the button's onPress executes toggleModal(), it changes the value of Modal's visible attr to false - and that seems to invoke onDismiss! Initially we had the same code for all three - so button does toggleModal() - and then onDismiss does toggleModal() again right afterwards - which opened the modal again right after closing! So we had to edit the code a bit: added "showModal: false" to resetForm() - which is not the most elegant solution due to redundancy - but it does bring safety! Don't waste any more time on it for now - move on! "showModal: false" solves it! It makes toggleModal() unnecessary in Modal's onDismiss and onRequestClose and in button's onPress - but we can leave it for now - in case we'll want to use it properly later. It's safe cause we have  big ugly patch on top of everything - "showModal: false"! Ugly - ok, but it solves averything!! And that's enough for now!! So don't waste any more time!
                    onRequestClose={() => { this.toggleModal(); this.resetForm(); }}// The onRequestClose callback is called when the user taps the HARDWARE back button on Android or the menu button on Apple TV
                >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Your Reservation</Text>
                        <Text style={styles.modalText}>Number of Guests: {this.state.guests}</Text>
                        <Text style={styles.modalText}>Smoking? {this.state.smoking ? 'Yes' : 'No'}</Text>
                        <Text style={styles.modalText}>Date and Time: {this.state.date}</Text>
                        <Button
                            title='Close'
                            onPress={() => { this.toggleModal(); this.resetForm(); }}
                            color='#512DA8'
                        />
                    </View>
                </Modal>
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