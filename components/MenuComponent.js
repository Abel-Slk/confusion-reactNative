import React from 'react';
import { SafeAreaView, View, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { DISHES } from '../shared/dishes';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dishes: DISHES
        };
    }

    // if you want to further customize for each of the components in your navigator, you can specify the navigation options like this inside the component:
    static navigationOptions = { // a static property - so that this can be used as Menu.navigationOptions? (see https://javascript.info/static-properties-methods#static-properties)
        title: 'Menu' // This will ensure that in my status bar when my menu component is displayed, the title that will be shown in the status bar would be Menu, as configured here
    };

    render() {

        // when you use a navigator, the navigation obj is one of the props that are AUTOMATICALLY passed to all the components in the navigator. So I am going to extract that out here. I'm going to need this in order to pass the information from menu component when I press on an item to the dish detail component through the navigator
        const { navigate } = this.props.navigation; // destructuring of an obj: from the navigation object copy the prop called navigate to const navigate (see 5_rest_spread.js)

        const renderMenuItem = ({ item, index }) => ( // item is the current element of the data array in FlatList
            <ListItem
                key={index}
                title={item.name}
                subtitle={item.description}
                hideChevron={true}
                leftAvatar={{ source: require('./images/uthappizza.png')}} 
                onPress={() => navigate('DishDetail', { dishId: item.id })}
            >{/* means navigate to DishDetail and pass it a param dishId with the value item.id. I specify here the name of the OTHER component - Dishdetail. Because when we configured navigator in the main component, we specified the two as Menu and Dishdetail. And in addition to navigating to that, I also use the second optional param of navigate() to to pass a parameter to DishDetail. That's how I am passing information from one component to the other component in the stack navigator. (We'll be able to retrieve the passed param in DishDetail using navigation.getParam()) */}
            
                {/* <Avatar rounded source={require('./images/uthappizza.png')} />
        
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                </ListItem.Content> */}
        
                {/* <ListItem.Chevron /> */}{/* if do want a chevron */}
            </ListItem>
        );

        return (
            <SafeAreaView>{/* mb just move SafeAreaView to Main? To cover all possible contents? */}
              <FlatList
                data={this.state.dishes} // takes an array of objects
                renderItem={renderMenuItem} // how to render each item in the list (in the data array). the value of the renderItem attr has to be a FUNCTION -- and that function will AUTOMATICALLY behind the scenes receive an object with 3 props: { item, index, separators }!! (https://reactnative.dev/docs/flatlist#renderitem) So it's a la <Route> with its { history, match, location }!! And We may use any of the 3 props if we want - and in our implementation of renderMenuItem() we've decided to use only { item }!
                keyExtractor={item => item.id.toString()} // this takes an item of the array and uses its id as a key. when you render a list of items, you have to Supply a key for each item. FlatList supports a keyExtractor which extracts one of the props off each item in the array and use that as a key. in this case, every item in the dishes.js file has an id. So I'm going to use this as my key for my items in the list
                // keyExtractor tells the list to use the ids for the react keys instead of the default key property (https://reactnative.dev/docs/flatlist#docsNav)
              />
            </SafeAreaView>
        );
    }
  
}

export default Menu;