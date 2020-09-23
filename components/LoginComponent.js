import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Icon, Input, CheckBox, Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { createBottomTabNavigator } from 'react-navigation';
import { baseUrl } from '../shared/baseUrl';

class LoginTab extends React.Component {
    constructor(props) {
        super(props); // can ignore for now - see the answer at https://stackoverflow.com/questions/63883401/react-native-context-and-deprecated-super-usage?noredirect=1&lq=1

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
        title: 'Login',

        // and in order to configure the TAB navigation, I will configure one more property called tabBarIcon:
        tabBarIcon: ({ tintColor }) => ( // return
            <Icon 
                name='sign-in'
                type='font-awesome'
                size={24}
                iconStyle={{ color: tintColor }}
            />
        )
    };

    handleLogin() {
        console.log(JSON.stringify(this.state));

        if (this.state.remember) { // if the remember checkbox was checked, then I will save the state to the secure storage
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
                        title='   Login'
                        onPress={() => this.handleLogin()}
                        icon={
                            <Icon 
                                type='font-awesome' 
                                name='sign-in'
                                size={23}
                                color='white' 
                            />
                        }
                        buttonStyle={{ backgroundColor: '#512DA8' }} // unlike RN's Button, RNE's Button doesn't have the color attr - and the color has to be styled in the buttonStyle attr
                    />
                </View>

                <View style={styles.formButton}>
                    <Button style={{ marginTop: 60 }}
                        title='   Register'
                        onPress={() => this.props.navigation.navigate('Register')}
                        clear // doesn't work anymore for RNE's Button?
                        icon={
                            <Icon 
                                type='font-awesome' 
                                name='user-plus'
                                size={23}
                                color='white' 
                            />
                        }
                        titleStyle={{ color: 'white' }}// text color
                        // buttonStyle={{ backgroundColor: '#512DA8' }}// we'll use the default blue instead
                    />
                </View>
            </View>
        );
    }
}

class RegisterTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl + 'images/logo.png'
        };
    }

    getImageFromCamera = async () => { // note - an async anonymous function
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' 
            && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true, // after the image is captured we can edit it initially
                aspect: [4, 3] // aspect ratio for the image
            });

            if (!capturedImage.cancelled) { // when the user is trying to capture the image from the camera, it's possible that we can cancel the capture. So in that case, the capturedImage.cancelled will be set to true, which means that we did not get the image, so there is nothing that you can do about it. But if not, then We get hold of the image
                this.setState({ imageUrl: capturedImage.uri }); // the camera returns this URI which is a URI of the image on the device's file storage. We'll use it to update the URL of our logo
            }
        }
    }

    static navigationOptions = {
        title: 'Register',

        // tab configuration:
        tabBarIcon: ({ tintColor }) => (
            <Icon 
                name='user-plus'
                type='font-awesome'
                size={24}
                iconStyle={{ color: tintColor }}
            />
        )
    };

    handleRegister() {
        console.log(JSON.stringify(this.state));

        if (this.state.remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({ username: this.state.username, password: this.state.password }) // I'm only saving the username and password, nothing else - so this is done exactly like in the LoginTab component
            )
            .catch(error => console.log('Could not save user info', error));
        }
        // I guess no else with SecureStore.deleteItemAsync('userinfo') here like we had in the LoginTab, cause registration means we're here for the first time
    }

    render() {
        return (
            <ScrollView>{/* since this is a huge file, I'm going to configure this to be inside a ScrollView - Just to be safe */}
                <View style={styles.container}>

                    <View style={styles.imageContainer}>
                        <Image style={styles.image}
                            source={{ uri: this.state.imageUrl }}
                            loadingIndicatorSource={require('./images/logo.png')} // when this image is being loaded, we'll temporarily show a local image here
                        />

                        <Button 
                            title='Take a Photo'
                            onPress={this.getImageFromCamera}
                        />
                    </View>

                    <Input
                        placeholder='Username'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        leftIconContainerStyle = {{ marginLeft: 0, marginRight: 15}}
                        onChangeText={username => this.setState({ username })}// short for username: username
                        value={this.state.username}
                        containerStyle={styles.formInput}// style for the Input (why not just style= though?)
                    />

                    <Input
                        placeholder='Password'
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        leftIconContainerStyle = {{ marginLeft: 0, marginRight: 15}}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                    />

                    <Input
                        placeholder='First Name'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        leftIconContainerStyle = {{ marginLeft: 0, marginRight: 15}}
                        onChangeText={firstname => this.setState({ firstname })}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                    />

                    <Input
                        placeholder='Last Name'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        leftIconContainerStyle = {{ marginLeft: 0, marginRight: 15}}
                        onChangeText={lastname => this.setState({ lastname })}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                    />

                    <Input
                        placeholder='Email'
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        leftIconContainerStyle = {{ marginLeft: 0, marginRight: 15}}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
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
                            title='  Register'
                            onPress={() => this.handleRegister()}
                            icon={
                                <Icon 
                                    type='font-awesome' 
                                    name='user-plus'
                                    size={23}
                                    color='white' 
                                />
                            }
                            buttonStyle={{ backgroundColor: '#512DA8' }} // unlike RN's Button, RNE's Button doesn't have the color attr - and the color has to be styled in the buttonStyle attr
                            
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

// we have created two tabs, LoginTab and RegisterTab - and now we need to show them as tabs - so we'll create a BottomTabNavigator which we'll call Login - and later export it as a default:
const Login = createBottomTabNavigator({
    Login: LoginTab,
    Register: RegisterTab
},
{
    tabBarOptions: {
        activeBackgroundColor: '#9575CD', // color for the active tab
        inactiveBackgroundColor: '#D1C4E9',
        activeTintColor: 'white',
        inactiveTintColor: 'gray'
    }
});

const styles = StyleSheet.create({ // should be outside any class -- I guess so that we can apply it to diff classes! Cause ex in this document we have two classes!
    container: { 
        justifyContent: 'center',
        margin: 20, // these numbers I figured out by trial and error, adjusting until the form looks decent on the screen. That's the standard way that you will figure out some of these things anyway
    },
    imageContainer: {
        flex: 1, 
        flexDirection: 'row',
        margin: 20
    },
    image: {
        margin: 10,
        width: 80,
        height: 60
    },
    formInput: {
        marginTop: 15,
        marginBottom: 15
    },
    formCheckbox: {
        margin: 15,
        backgroundColor: null // so that the checkbox integrates into the rest of my application
    },
    formButton: {
        margin: 20,
        marginBottom: 40
    }
});

export default Login;