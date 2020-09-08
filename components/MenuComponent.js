import React from 'react';
import { SafeAreaView, View, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

const Menu = props => {

  const renderMenuItem = ({ item }) => (
    <ListItem onPress={() => props.onPressing(item.id)}>
    {/*it seems that onPress attr/prop is NOT defined by default for ALL components! It seems to be defined (behind the scenes) for ListItem, but it DOESN'T seem to be defined by default for OUR own custom components like Menu! So when we pass the onPress attr to Menu, it's not executed on pressing sth in Menu! And we don't want to execute it there anyway - we just want to pass it to Menu to use it inside Menu! BUT ListItem from react-native-elements seems to have onPress defined for it!! So that passing the onPress attr to ListItem results in an action being fired up when we press on a ListItem!! (the docs really list onPress among ListItem's props: https://react-native-elements.github.io/react-native-elements/docs/listitem#props )
    // Really Seems this way - only like this it makes sense! onPress is not defined for Menu (and we can use any name instead actually I guess!), so no action is fired up upon pressing Menu - and we just pass the function to Menu. But ListItem really has the onPress prop (which really gotta be called like that to work I guess!) - and it really fires up on pressing! And I guess what it actually does on press has to be implemented as a function expression!
    // check later - try changing name in Menu!!! */}
    
        <Avatar rounded source={require('./images/uthappizza.png')} />

        <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        </ListItem.Content>

        {/* <ListItem.Chevron /> */}{/* if do want a chevron */}
    </ListItem>
  );

  return (
    <SafeAreaView>
      <FlatList
        data={props.dishes} // takes an array of objects
        renderItem={renderMenuItem} // how to render each item in the list (in the data array). the value of the renderItem attr has to be a FUNCTION -- and that function will AUTOMATICALLY behind the scenes receive an object with 3 props: { item, index, separators }!! (https://reactnative.dev/docs/flatlist#renderitem) So it's a la <Route> with its { history, match, location }!! So We may use any of the 3 props if we want - and in our implementation of renderMenuItem() we've decided to use only { item }!
        keyExtractor={item => item.id.toString()} // this takes an item of the array and uses its id as a key. when you render a list of items, you have to Supply a key for each item. FlatList supports a keyExtractor which extracts one of the props off each item in the array and use that as a key. in this case, every item in the dishes.js file has an id. So I'm going to use this as my key for my items in the list
        // keyExtractor tells the list to use the ids for the react keys instead of the default key property (https://reactnative.dev/docs/flatlist#docsNav)
      />
    </SafeAreaView>
  );
}

export default Menu;