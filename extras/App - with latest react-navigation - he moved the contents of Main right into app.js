import * as React from 'react';
import { Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AboutComponent from './components/AboutComponent';
import ContactComponent from './components/ContactComponent';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
const screen1Navigator = createStackNavigator({
  screenOne : {
    screen : AboutComponent,
    navigationOptions : {
      title: 'About Us',
    }
  }
})
const screen2Navigator = createStackNavigator({
  screenTwo : {
    screen : ContactComponent,
    navigationOptions : {
      title: 'Contact Us',
    }
  }
})

const myDrawer = createDrawerNavigator(
  {
    AboutUs: {
      screen: screen1Navigator,
    },
    ContactUs: {
      screen: screen2Navigator,
    },

  },
  {
    drawerBackgroundColor: 'white'
    
  },
);

const AppContainer = createAppContainer(myDrawer);
const App = () => {
  return <AppContainer />; 
};

export default App;
