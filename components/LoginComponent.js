import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Icon, Input, CheckBox, Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { createBottomTabNavigator } from 'react-navigation';
import { baseUrl } from '../shared/baseUrl';
import { Asset } from 'expo-asset';
import * as ImageManipulator from "expo-image-manipulator";

class LoginTab extends React.Component {
    constructor(props) {
        super(props); 

        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo') 
            .then(userdata => {
                let userinfo = JSON.parse(userdata); 
                if (userinfo) { 
                    this.setState({ username: userinfo.username });
                    this.setState({ password: userinfo.password });
                    this.setState({ remember: true }); 
                }
            });
    }

    static navigationOptions = {
        title: 'Login',

        // to configure tab navigation:
        tabBarIcon: ({ tintColor }) => ( 
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

        if (this.state.remember) { // then save the state to the secure storage
            SecureStore.setItemAsync( 
                'userinfo',
                JSON.stringify({ username: this.state.username, password: this.state.password })
            ) 
            .catch(error => console.log('Could not save user info', error));
        }
        else 
            SecureStore.deleteItemAsync('userinfo')
            .catch(error => console.log('Could not delete user info', error));

    }

    render() {
        return (
            <View style={styles.container}>
                <Input 
                    placeholder='Username'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    leftIconContainerStyle = {{ marginLeft:0, marginRight: 15}}
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}
                    containerStyle={styles.formInput}
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
                    center 
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
                        buttonStyle={{ backgroundColor: '#512DA8' }} 
                    />
                </View>

                <View style={styles.formButton}>
                    <Button style={{ marginTop: 60 }}
                        title='   Register'
                        onPress={() => this.props.navigation.navigate('Register')}
                        clear 
                        icon={
                            <Icon 
                                type='font-awesome' 
                                name='user-plus'
                                size={23}
                                color='white' 
                            />
                        }
                        titleStyle={{ color: 'white' }}
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

    getImageFromCamera = async () => { 
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' 
            && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchCameraAsync({ 
                allowsEditing: true, 
                aspect: [4, 3] 
            });

            if (!capturedImage.cancelled) { 
                this.processImage(capturedImage.uri); 
            }
        }
    }

    getImageFromGallery = async () => {
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL); 

        if (cameraRollPermission.status === 'granted') {
            let selectedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            if (!selectedImage.cancelled) { 
                this.processImage(selectedImage.uri);
            }
        }
    }

    // after taking/selecting a photo:
    processImage = async (imageUri) => {
        let processedImage = await ImageManipulator.manipulateAsync(
            imageUri, 
            [ // actions to be taken
                { resize: { width: 400 }} 
            ],
            { format: 'png' } // output format options
        );

        this.setState({ imageUrl: processedImage.uri }); // use it to update the URL of our profile photo
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
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>

                    <View style={styles.imageContainer}>
                        <Image style={styles.image}
                            source={{ uri: this.state.imageUrl }}
                            loadingIndicatorSource={require('./images/logo.png')} // when this image is being loaded, temporarily show a local image here
                        />

                        <Button 
                            title='Camera'
                            onPress={this.getImageFromCamera}
                        />
                        <Button 
                            title='Gallery'
                            onPress={this.getImageFromGallery}
                        />
                    </View>

                    <Input
                        placeholder='Username'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        leftIconContainerStyle = {{ marginLeft: 0, marginRight: 15}}
                        onChangeText={username => this.setState({ username })}
                        value={this.state.username}
                        containerStyle={styles.formInput}
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
                        center 
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
                            buttonStyle={{ backgroundColor: '#512DA8' }} 
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const Login = createBottomTabNavigator({
    Login: LoginTab,
    Register: RegisterTab
},
{
    tabBarOptions: {
        activeBackgroundColor: '#9575CD', 
        inactiveBackgroundColor: '#D1C4E9',
        activeTintColor: 'white',
        inactiveTintColor: 'gray'
    }
});

const styles = StyleSheet.create({ 
    container: { 
        justifyContent: 'center',
        margin: 20, 
    },
    imageContainer: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        backgroundColor: null 
    },
    formButton: {
        margin: 20,
        marginBottom: 40
    }
});

export default Login;