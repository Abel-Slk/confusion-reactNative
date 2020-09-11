import React from 'react';
import { SafeAreaView, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { DISHES } from '../shared/dishes';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dishes: DISHES
        };
    }


    static navigationOptions = { // a static property - so that this can be used as Menu.navigationOptions? Ie not requiring an obj? Cause with components we use classes directly, without creating instances? (see https://javascript.info/static-properties-methods#static-properties)
    // if you want to further customize a component in your navigator, you can specify navigationOptions like this inside the component (in addition to / instead of general navigationOptions inside MenuNavigator, which are specified for all components at once)
        title: 'Menu' // the title that will be shown in the status bar when my menu component is displayed
    };

    render() {

        const { navigate } = this.props.navigation; // destructuring of an obj: from the navigation object copy the prop called navigate (this.props.navigation.navigate) to const navigate (see 5_rest_spread.js)
        // when you use a navigator, the navigation obj is one of the props that are AUTOMATICALLY passed to all the components in the navigator. I'll extract here from the navigation obj its property navigation.navigate(). 
        // We'll use navigate() to navigate from Menu to DishDetail when I press on an item and also to pass along the way a param containing the dish id. We'll to retrieve the passed param in DishDetail using navigation.getParam() 

        const renderMenuItem = ({ item, index }) => ( // renderMenuItem receives into item the current element of the data array in FlatList
            <ListItem
                key={index}
                title={item.name}
                subtitle={item.description}
                hideChevron={true}
                leftAvatar={{ source: require('./images/uthappizza.png')}} 
                onPress={() => navigate('DishDetail', { dishId: item.id })}
            >{/* means navigate to DishDetail and pass it a param dishId with the value item.id. I specify here the name of the OTHER component - Dishdetail. Because when we configured navigator in the main component, we specified the two as Menu and Dishdetail. And in addition to navigating to that, I also use the second optional param of navigate() to to pass a parameter to DishDetail. That's how I am passing information from one component to the other component in the stack navigator. (We'll retrieve the passed param in DishDetail using navigation.getParam()) */}
            

                {/* same using the latest version of react-native-elements: */}
                {/* <Avatar rounded source={require('./images/uthappizza.png')} />
        
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                </ListItem.Content> */}
        
                {/* <ListItem.Chevron /> */}{/* if do want a chevron */}
            </ListItem>
        );

        return (
            <SafeAreaView>
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