import React from 'react';
// import { View, Flatlist } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';

const Menu = props => {

  const renderMenuItem = ({ item }) => (
    <ListItem 
        leftAvatar={{ source: require('./images/uthappizza.png')}}
    >
        <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        </ListItem.Content>

        {/* <ListItem.Chevron /> */}{/* if do want a chevron */}
    </ListItem>
  );

  return (
    <SafeAreaView >
      <FlatList
        data={props.dishes} // takes an array of objects
        renderItem={renderMenuItem} // how to render each item in the list (in the data array). -- How come though that renderMenuItem receives { item } as prop?? We're not passing it anything here!.. So it looks like renderItem is passing to renderMenuItem the current element of the array as the "item" prop behind the scenes!! A la <Route>!!
        keyExtractor={item => item.id.toString()} // this takes an item of the array and uses its id as a key. when you render a list of items, you have to Supply a key for each item. FlatList supports a keyExtractor which extracts one of the props off each item in the array and use that as a key. in this case, every item in the dishes.js file has an id. So I'm going to use this as my key for my items in the list
      />
    </SafeAreaView>
  );
}

export default Menu;