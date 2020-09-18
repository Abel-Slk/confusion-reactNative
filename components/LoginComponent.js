import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Card, Icon, Input, CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store'; // https://docs.expo.io/versions/latest/sdk/securestore/

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo') // GETItemAsync() retrieves an item from the secure store. this returns the promise. in the promise, we'll get hold of the result (we'll call it userdata - cause that's what it is)
            .then(userdata => {
                let userinfo = JSON.parse(userdata); // convert JSON string into a JS obj (cause what is stored in the secure storage is a JSON string - you can't store a JS obj in the secure store)
                if (userinfo) { // if not null (ie if it exists)
                    this.setState({ username: userinfo.username });
                    this.setState({ password: userinfo.password });
                    this.setState({ remember: true }); // because if userinfo exists then the user already saved the username and password to the secure store earlier
                }
            });
    }

    static navigationOptions = {
        title: 'Login'
    };

    handleLogin() {
        console.log(JSON.stringify(this.state));

        if (this.state.remember) { // if remember is true, which means that the checkbox was checked, then I will save the state to the secure storage
            SecureStore.setItemAsync( // SETItemAsync stores an item in the secure store. we're using the key 'userinfo' - and this key should be exactly the same as the key that you use in GETItemAsync() in componentDidMount() - you should use exactly the same key for storing and retrieving the info
            // params - a key-value pair: the key of the item and the item in the format of a JSON string
                'userinfo',
                JSON.stringify({ username: this.state.username, password: this.state.password })
            ) //  this will return a promise. Now, for the then part, I am not going to handle that, but I want to handle if there is any error:
            .catch(error => console.log('Could not save user info', error));
        }
        else // if the checkbox was unchecked - which means that you need to delete whatever you have in the secure store [if only we had info remembered earlier], because you don't want to persist this information [anymore]
            SecureStore.deleteItemAsync('userinfo')
            .catch(error => console.log('Could not delete user info', error));

    }

    render() {
        return (
            <View style={styles.container}>
                <Input // this Input is a controlled component - sends the user input to the state and then takes its value from the state
                    placeholder='Username'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    leftIconContainerStyle = {{ marginLeft:0, marginRight: 15}}
                    onChangeText={username => this.setState({ username })}// short for username: username
                    value={this.state.username}
                    containerStyle={styles.formInput}// style for the Input (why not just style= though?)
                />

                <Input
                    placeholder='Password'
                    leftIcon={{ type: 'font-awesome', name: 'key' }}
                    leftIconContainerStyle = {{ marginLeft:0, marginRight: 15}}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                />

                <CheckBox
                    title='Remember Me'
                    center // Aligns checkbox to center
                    checked={this.state.remember}
                    onPress={() => this.setState({ remember: !this.state.remember })}
                    containerStyle={styles.formCheckbox}
                />

                <View style={styles.formButton}>
                    <Button 
                        title='Login'
                        color='#512DA8'
                        onPress={() => this.handleLogin()}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({ // should be outside the class for some reason!
    container: { 
        justifyContent: 'center',
        margin: 20, // these numbers I figured out by trial and error, adjusting until the form looks decent on the screen. That's the standard way that you will figure out some of these things anyway
    },
    formInput: {
        marginTop: 20,
        marginBottom: 20
    },
    formCheckbox: {
        margin: 40,
        backgroundColor: null // so that the checkbox integrates into the rest of my application
    },
    formButton: {
        margin: 20
    }
});

export default Login;