import React from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import DishDetail from './DishDetailComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import Reservation from './ReservationComponent';
import Favorites from './FavoriteComponent';
import Login from './LoginComponent';
import { View, Platform, Image, StyleSheet, ScrollView, Text, ToastAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { createStackNavigator, createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation'; // downgraded to react-navigation@2.0.1 instead of the latest version - '@react-navigation/native' (v5). 
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchLeaders, fetchPromos } from '../redux/ActionCreators';

// IMPORTANT NOTE: I had to remove latest versions of react-native-elements and react-navigation that I decided to install initially and had to install old versions that Muppala was using - cause otherwise I wasn't able to get the app to work!.. And even then I got an error described at https://stackoverflow.com/questions/60944091/taskqueue-error-with-task-undefined-is-not-an-object-evaluating-this-view - Perhaps cause I created the app differently from Muppala - cause I wasn't even able to create it using create-react-native-app like he was doing! So I used the latest way! And the error described at SO - I solved it using the second way in Leonid's answer in the link
// so changing versions is dangerous! Might easily break the code! Even the react-navigation docs themselves give reasons about when you need to upgrade to the latest version and when you DON'T: https://reactnavigation.org/docs/upgrading-from-4.x#configuring-the-navigator Also, this article https://chinloongtan.com/blog/upgrading-react-native-project/ describes in detail how upgrading can break everything - and advises to upgrade only when absolutely necessary and when there's no alternative!! So I really better stick with Muppala's versions whenever possible!!!..

const mapStateToProps = state => {
    return {
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchDishes: () => dispatch(fetchDishes()),
        fetchComments: () => dispatch(fetchComments()),
        fetchPromos: () => dispatch(fetchPromos()),
        fetchLeaders: () => dispatch(fetchLeaders())
    }
};


// creating a new component called MenuNavigator - a StackNavigator component:
const MenuNavigator = createStackNavigator( // https://reactnavigation.org/docs/upgrading-from-4.x#configuring-the-navigator
// two params - two objects: first an obj for configuration where you specify the screens. And then the second obj where we can specify some navigation options
    {
        Menu: { // when you make the choice called Menu, navigate to the screen Menu
            screen: Menu, // a short version for Menu: {screen: Menu} is just Menu: Menu. But with the full form, we can also add additional options if we want (besides the screen prop). you will see me using both kinds

            // include the toggle button on the Menu screen/view:
            navigationOptions: ({ navigation }) => ({ // returns an obj
            // we've changed this navigationOptions from an obj to a function returning an obj - cause now we want to pass a param to it! So we've changed here navigationOptions: {...} to navigationOptions: ({ navigation }) => ({...})
            // navigationOptions can be defined as an obj or as a function. This function gets the navigation props as a parameter. (so I guess we implement navigationOptions as an obj when we don't need no params, and as a function that returns an obj when we do need to pass sth to navigationOptions?) So from the navigation props, I'm going to extract out navigation. And inside this arrow function we'll specify additional navigation options
                headerLeft: <Icon name='menu' size={26} color='white' onPress={() => navigation.toggleDrawer()} /> // headerLeft will add whatever we supply here to the left of the header in that status bar of this view (the Menu view). We'll add this to all other navigators/views as well. note that we have name='menu' for all components, not just in Menu - cause 'menu' is just the name of that Icon
            })
            
        },  
        
        DishDetail: { 
            screen: DishDetail 
            // don't need no toggle button here cause we'll have automatically created back button there to go back to Menu!
        }
    },
    {
        initialRouteName: 'Menu', // to start this StackNavigator with Menu as the first screen (we can choose here from the options that we have above - either Menu or DishDetail)
        navigationOptions: { // There are two places where we can specify navigationOptions. When you specify navigationOptions here, they'll be applied to all the screens inside this navigator. so if you have some common configuration for all the various screens within your navigator, then you can specify it here. You can also do further customization within each component. And you will see me doing that in a short while
            headerStyle: { // header for our StackNavigator
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', // This'll be used for any icons in the header
            headerTitleStyle: { 
                color: '#fff'
            }
        }
    }
);

// We'll create our main navigator using drawer navigation. HomeNavigator, AboutNavigator and ContactNavigator components will be placed inside the drawer. we'll create each of them using the same approach as for the menu navigator:
const HomeNavigator = createStackNavigator( // The reason for creating the home navigator using createStackNavigator() is that it provides the status bar, a way of specifying the navigation and the title for that home. Without createStackNavigator() we don't get access to that. So even though there is only one screen here, I'm still putting it into createStackNavigator()
    {
        Home: { 
            screen: Home 
        }
    },
    {
        // we don't need initialRouteName here cause we have only one screen

        navigationOptions: ({ navigation }) => ({
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            },
            headerLeft: <Icon name='menu' size={26} color='white' 
                onPress={() => navigation.toggleDrawer()} />
        })
    }
);

const AboutNavigator = createStackNavigator( // ~~ the About view
    {
        About: { 
            screen: About
        }
    },
    {
        navigationOptions: ({ navigation }) => ({ 
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            },
            headerLeft: <Icon name='menu' size={26} color='white' 
                onPress={() => navigation.toggleDrawer()} />
        })
    }
);

const ContactNavigator = createStackNavigator(
    {
        Contact: { 
            screen: Contact
        }
    },
    {
        navigationOptions: ({ navigation }) => ({ 
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            },
            headerLeft: <Icon name='menu' size={26} color='white' 
                onPress={() => navigation.toggleDrawer()} />
        })
    }
);

const ReservationNavigator = createStackNavigator(
    {
        Reservation: { 
            screen: Reservation
        }
    },
    {
        navigationOptions: ({ navigation }) => ({ 
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            },
            headerLeft: <Icon name='menu' size={26} color='white' 
                onPress={() => navigation.toggleDrawer()} />
        })
    }
);

const FavoritesNavigator = createStackNavigator(
    {
        Favorites: { 
            screen: Favorites
        }
    },
    {
        navigationOptions: ({ navigation }) => ({ 
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            },
            headerLeft: <Icon name='menu' size={26} color='white' 
                onPress={() => navigation.toggleDrawer()} />
        })
    }
);

const LoginNavigator = createStackNavigator(
    {
        Login: { 
            screen: Login
        }
    },
    {
        navigationOptions: ({ navigation }) => ({ 
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            },
            headerLeft: <Icon name='menu' size={26} color='white' 
                onPress={() => navigation.toggleDrawer()} />
        })
    }
);

const CustomDrawerContentComponent = props => ( // this is the configuration of content layout that we'll use in our MainNavigator drawer component
    <ScrollView>
        <SafeAreaView style={styles.container} 
            forceInset={{ top: 'always', horizontal: 'never' }}>{/* SafeAreaView is specifically for iPhone X and defines a part of the area as a safe area where nothing else will be laid out. See more at https://reactnavigation.org/docs/handling-safe-area/ */}
            {/* top: 'always', so this side drawer will be displayed on top, even covering the status bar on top */}

            <View style={styles.drawerHeader}>
                
                <View style={{ flex: 1 }}>{/* https://stackoverflow.com/questions/37386244/what-does-flex-1-mean */}
                {/* I specified flex: 1 for the first View and flex: 2 for the second, so the second View will occupy twice the amount of space horizontally as the first. So if the total amount of space in your header horizontally is divided into three units, first will occupy 1 unit and second will occupy 2 units */}
                    <Image source={require('./images/logo.png')}
                        style={styles.drawerImage} />
                </View>

                <View style={{ flex: 2 }}>
                    <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
                </View>
            </View>

            <DrawerItems {...props} />{/* DrawerItems is what is automatically constructed by the createDrawerNavigator that we use in MainNavigator */}
            {/* ...props: Whatever the props are, just pass them all to the DrawerItems component (spread those props!) (and it looks like CustomDrawerContentComponent will AUTOMATICALLY receive as props all the drawer items when we pass CustomDrawerContentComponent to MainNavigator?) */}
        </SafeAreaView>
    </ScrollView>
);

// and finally we collect all those into our drawer navigator:
const MainNavigator = createDrawerNavigator(
    { // routeConfigs param
        Login: { // we want to place Login at the top of the drawer. But the default way a DrawerNavigator works is that this first entry in the drawer would become the first screen shown. And we don't want the login screen to be shown first. Instead you want to just show the home screen. The login should be something that the user explicitly does. So, that's why I will set up the initialRouteName in the config param below to point to the Home component
            screen: LoginNavigator,
            navigationOptions: {
                title: 'Login', // not sure what title and drawerLabel do here - tried removing them and didn't see any difference! The title is still 'Home' in the drawer - it's probably received from the HoveNavigator screen, which receives it from the Home component!
                drawerLabel: 'Login',
                drawerIcon: ({ tintColor }) => ( // drawerIcon will receive (automatically!) tintColor as one of the params (where from though? I guess can see in the docs if necessary - but it might be deprecated already anyway). tintColor will specify how to render the icon in the drawer. this is specified as an arrow function
                    <Icon 
                        name='sign-in' 
                        type='font-awesome'
                        size={24}
                        color={tintColor} 
                    />
                )
            }
        },
        Home: {
            screen: HomeNavigator,
            navigationOptions: {
                title: 'Home', // not sure what title and drawerLabel do here - tried removing them and didn't see any difference! The title is still 'Home' in the drawer - it's probably received from the HoveNavigator screen, which receives it from the Home component!
                drawerLabel: 'Home',
                drawerIcon: ({ tintColor }) => ( // drawerIcon will receive (automatically!) tintColor as one of the params (where from though? I guess can see in the docs if necessary - but it might be deprecated already anyway). tintColor will specify how to render the icon in the drawer. this is specified as an arrow function
                    <Icon 
                        name='home' 
                        type='font-awesome'
                        size={24}
                        color={tintColor} 
                    />
                )
            }
        },
        Menu: {
            screen: MenuNavigator,
            navigationOptions: { 
                title: 'Menu',
                drawerLabel: 'Menu',
                drawerIcon: ({ tintColor }) => (
                    <Icon 
                        name='list' 
                        type='font-awesome'
                        size={22}// made it a bit smaller cause looks big
                        color={tintColor} 
                    />
                )
            }
        },
        About: {
            screen: AboutNavigator,
            navigationOptions: { 
                title: 'About',
                drawerLabel: 'About',
                drawerIcon: ({ tintColor }) => (
                    <Icon 
                        name='info-circle' 
                        type='font-awesome'
                        size={24}
                        color={tintColor} 
                    />
                )
            }
        },
        Contact: {
            screen: ContactNavigator,
            navigationOptions: { 
                title: 'Contact',
                drawerLabel: 'Contact',
                drawerIcon: ({ tintColor }) => (
                    <Icon 
                        name='address-card' 
                        type='font-awesome'
                        size={22}
                        color={tintColor} 
                    />
                )
            }
        },
        Favorites: {
            screen: FavoritesNavigator,
            navigationOptions: { 
                title: 'My Favorites',
                drawerLabel: 'My Favorites',
                drawerIcon: ({ tintColor }) => (
                    <Icon 
                        name='heart' 
                        type='font-awesome'
                        size={24}
                        color={tintColor} 
                    />
                )
            }
        },
        Reservation: {
            screen: ReservationNavigator,
            navigationOptions: { 
                title: 'Reserve Table',
                drawerLabel: 'Reserve Table',
                drawerIcon: ({ tintColor }) => (
                    <Icon 
                        name='cutlery' 
                        type='font-awesome'
                        size={24}
                        color={tintColor} 
                    />
                )
            }
        }
    },
    { // config param
        initialRouteName: 'Home',
        drawerBackgroundColor: '#D1C4E9',
        contentComponent: CustomDrawerContentComponent // here we specify the layout of the drawer to be what I have specified in CustomDrawerContentComponent. how did I figure this out? Reading the documentation. So reading the documentation reveals a lot of interesting information
    }
);

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            unsubscribe: () => { }
        }
    }

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();

        
        NetInfo.fetch() // Muppala had here NetInfo.getConnectionInfo()
            .then(connectionInfo => {
                if (Platform.OS === 'ios') {
                    alert('Initial Network Connectivity Type: '+ connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType); // if will want to implement it better than using a simple alert - see suggestions at https://stackoverflow.com/questions/18680891/displaying-a-message-in-ios-which-has-the-same-functionality-as-toast-in-android
                }
                else
                    ToastAndroid.show(
                        'Initial Network Connectivity Type: '+ connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType, ToastAndroid.LONG); // ToastAndroid.LONG for a long duration
            });

        let returnedFunction = NetInfo.addEventListener(this.handleConnectivityChange); // see the addEventListener()'s pop-up
        // Muppala had it as NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
        this.setState({ unsubscribe: returnedFunction }) // we need to store somewhere the function returned by NetInfo.addEventListener() - to be able to use it later in componentWillUnmount(). To have it visible outside of the current function, componentDidMount(), had to store it in the state of the component
        
    }

    componentWillUnmount() {
        this.state.unsubscribe(); // instead of NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange); - now deprecated, doesn't work anymore
    }

    handleConnectivityChange = connectionInfo => {
        switch(connectionInfo.type) {
            case 'none':
                if (Platform.OS === 'ios') {
                    alert('You are now offline');
                }
                else {
                    ToastAndroid.show('You are now offline', ToastAndroid.LONG);
                }
                break; // When JS reaches a break keyword, it breaks out of the switch block. It is not necessary to break the last case in a switch block. The block breaks (ends) there anyway. 
                // Note: If you omit the break statement, the next case will be executed even if the evaluation does not match the case. (Really? Then Why didn't we use breaks after each case in our reducers?..)

            case 'wifi':
                if (Platform.OS === 'ios') {
                    alert('You are now connected to WiFi');
                }
                else {
                    ToastAndroid.show('You are now connected to WiFi', ToastAndroid.LONG);
                }
                break;

            case 'cellular':
                if (Platform.OS === 'ios') {
                    alert('You are now connected to a cellular network');
                }
                else {
                    ToastAndroid.show('You are now connected to a cellular network', ToastAndroid.LONG);
                }
                break;

            case 'unknown':
                if (Platform.OS === 'ios') {
                    alert('You now have an unknown connection');
                }
                else {
                    ToastAndroid.show('You now have an unknown connection', ToastAndroid.LONG);
                }
                break;

            default: 
                break; // break here is actually not needed if default is placed last!
        }
    }

    render() {
        return (
            <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>{/* if this app is running on an ios device, then we will configure the paddingTop to be 0, otherwise Expo.Constants.StatusBarHeight in android will give enough space on the top for the status bar to be displayed */}
            
                <MainNavigator />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    drawerHeader: {
        backgroundColor: '#512DA8',
        height: 140,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection: 'row' // so the logo and the restaurant name inside the drawerHeader will be laid out along the row axis, rather than in the column axis
    },
    drawerHeaderText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        width: 80,
        height: 60
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);