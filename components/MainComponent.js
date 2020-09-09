import React from 'react';
import Menu from './MenuComponent';
import { DISHES } from '../shared/dishes';
import DishDetail from './DishDetailComponent';
import { ScrollView, View, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/native';

// creating a new component called MenuNavigator component which is a StackNavigator component:
const MenuNavigator = createStackNavigator( // https://reactnavigation.org/docs/upgrading-from-4.x#configuring-the-navigator
    // two params - two objects: first an object for configuration, where you specify the various screens. And then the second obj where we can specify some navigationOptions. Docs: The first parameter was an object containing route configuration, and the second parameter was configuration for the navigator
    {
        Menu: { 
            screen: Menu 
        }, // this says: when you make this choice Menu, navigate to the screen Menu 
        // a shortened version would be to just say Menu: Menu. But with this approach, we can add additional options if we want. you will see me using both kinds
        DishDetail: { 
            screen: DishDetail 
        }
        // now my main component is ready to receive these two components and then build a state navigator out of them
    },
    {
        initialRouteName: 'Menu', // So this StackNavigator starts with Menu as the first screen when this component is the stack
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

export default class Main extends React.Component {
    render() {
        return (
            // <ScrollView> //initially had <View style={{flex: 1}}> here - just sth to enclose stuff into cause we have multiple elements here (like we did with React.Fragment in React) - but View didn't allow to scroll content! (Muppala didn't notice this cause he was testing on a tablet where everything was fitting the screen!) ScrollView seems to be pretty much the same as View (it inherits Views props) - but it does allow scrolling! See http://reactnative.dev/docs/scrollview 
           // Note: this is a temp solution - throws a warning about ScrollView conflicting with Flatlist - and better make the links go to other pages/view - cause otherwise unless you scroll down you won't see the dish! This gotta be reworked! Just gotta move opening the card on press to a diff view! And then can change ScrollView back to view - and then the conflict between ScrollView and FlatList with be solved!

            <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}> {/* Platform from react-native gives me access to information about the specific platform on which my react-native app is running. So you can ask questions like this here: if this app is running on an ios device, then we will configure the paddingTop to be 0, otherwise Expo.Constants.StatusBarHeight in android will give enough space on the top for the status bar to be displayed */}

                <MenuNavigator />{/* now doing MenuNavigator wrapped in a View instead of Menu and DishDetail wrapped in a ScrollView! */}
                

                
                {/* we're just passing this onPress function to the Menu to use it there. Note that we're defining onPress to be a function that takes one param - dishId. So when we'll actually be calling onPress, we'll need to call it with an arg - as onPress(dishIdArg)! And so We'll use it in Menu in <ListItem onPress={() => props.onPress(item.id)}. calling onPress(item.id) sets the value of the dishId param to be item.id */}
                {/* I guess we need to define this function in Main, not in Menu, cause we're using onDishSelect() which is modifying the state! */}
                {/* see comment to onPress in Menu!! */}
                
                {/* <Menu dishes={this.state.dishes}
                onPressing={dishId => this.onDishSelect(dishId)} />

                <DishDetail dish={this.state.dishes.filter(dish => dish.id === this.state.selectedDish)[0]}/> */}

            </View>
            //</ScrollView>
        );
    }
}