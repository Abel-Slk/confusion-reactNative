import React from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import DishDetail from './DishDetailComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import { View, Platform } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'; // downgraded to react-navigation@2.0.1 instead of the latest version - '@react-navigation/native' (v5). 

// IMPORTANT NOTE: I had to remove latest versions of react-native-elements and react-navigation that I decided to install initially and had to install old versions that Muppala was using - cause otherwise I wasn't able to get the app to work!.. And even then I got an error described at https://stackoverflow.com/questions/60944091/taskqueue-error-with-task-undefined-is-not-an-object-evaluating-this-view - Perhaps cause I created the app differently from Muppala - cause I wasn't even able to create it using create-react-native-app like he was doing! So I used the latest way! And the error described at SO - I solved it using the second way in Leonid's answer in the link
// so changing versions is dangerous! Might easily break the code! Even the react-navigation docs themselves give reasons about when you need to upgrade to the latest version and when you DON'T: https://reactnavigation.org/docs/upgrading-from-4.x#configuring-the-navigator Also, this article https://chinloongtan.com/blog/upgrading-react-native-project/ describes in detail how upgrading can break everything - and advises to upgrade only when absolutely necessary and when there's no alternative!! So I really better stick with Muppala's versions whenever possible!!!..


// creating a new component called MenuNavigator - a StackNavigator component:
const MenuNavigator = createStackNavigator( // https://reactnavigation.org/docs/upgrading-from-4.x#configuring-the-navigator
// two params - two objects: first an object for configuration where you specify the screens. And then the second obj where we can specify some navigation options
    {
        Menu: { // when you make the choice called Menu, navigate to the screen Menu
            screen: Menu // a short version for Menu: {screen: Menu} is just Menu: Menu. But with this approach, we can add additional options if we want (besides the screen prop). you will see me using both kinds
        },  
        
        DishDetail: { 
            screen: DishDetail 
        }
        // now my main component is ready to receive these two components and then build a state navigator out of them
    },
    {
        initialRouteName: 'Menu', // to start this StackNavigator with Menu as the first screen (we can choose here from the options that we have above - either Menu or DishDetail)
        navigationOptions: { // There are two places where we can specify navigationOptions. When you specify navigationOptions here, they'll be applied to all the screens inside this navigator. so if you have some common configuration for all the various screens within your navigator, then you can specify it here. You can also do further customization within each component. And you will see me doing that in a short while
            headerStyle: { // header for our StackNavigator
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', // This'll be used for any icons that you use in your headerStyle
            headerTitleStyle: { // This is for the title in the header 
                color: '#fff'
            }
        }
    }
);

// We'll create our main navigator using drawer navigation. HomeNavigator, AboutNavigator and ContactNavigator components will be placed inside the drawer. we'll create them using exactly the same approach that we have used for the menu navigator:
const HomeNavigator = createStackNavigator( // we'll use HomeNavigator later in the MainNavigator drawer navigator. The reason for creating the home navigator using createStackNavigator() is that it provides the status bar, a way of specifying the navigation and the title for that home. Without createStackNavigator() we don't get access to that. So even though there is only one screen here, I'm still putting it into createStackNavigator() and creating a stack navigator component which I'll use when I set up my drawer-based navigator
    {
        Home: { 
            screen: Home 
        }
    },
    {
        // we don't need initialRouteName here cause we have only one screen

        navigationOptions: { 
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            }
        }
    }
);

const AboutNavigator = createStackNavigator(
    {
        About: { 
            screen: About
        }
    },
    {
        navigationOptions: { 
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            }
        }
    }
);

const ContactNavigator = createStackNavigator(
    {
        Contact: { 
            screen: Contact
        }
    },
    {
        navigationOptions: { 
            headerStyle: { 
                backgroundColor: '#512DA8'
            },
            headerTintColor: '#fff', 
            headerTitleStyle: { 
                color: '#fff'
            }
        }
    }
);
// and now we finally create a drawer navigator:
const MainNavigator = createDrawerNavigator(
    {
        Home: {
            screen: HomeNavigator,
            navigationOptions: { // The reason I specifically use the navigation options is that I need to set up the drawer label here
                title: 'Home',
                drawerLabel: 'Home'
            }
        },
        Menu: {
            screen: MenuNavigator,
            navigationOptions: { 
                title: 'Menu',
                drawerLabel: 'Menu'
            }
        },
        About: {
            screen: AboutNavigator,
            navigationOptions: { 
                title: 'About',
                drawerLabel: 'About'
            }
        },
        Contact: {
            screen: ContactNavigator,
            navigationOptions: { 
                title: 'Contact',
                drawerLabel: 'Contact'
            }
        }
    },
    {
        drawerBackgroundColor: '#D1C4E9'
    }
);

export default class Main extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>{/* if this app is running on an ios device, then we will configure the paddingTop to be 0, otherwise Expo.Constants.StatusBarHeight in android will give enough space on the top for the status bar to be displayed */}
            
                <MainNavigator />
            </View>
        );
    }
}