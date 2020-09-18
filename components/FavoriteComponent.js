import React from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import Swipeout from 'react-native-swipeout';
import { deleteFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable'; 

// Note: for now favorites are persisting between the app closing and opening, but comments don't - that's because we're storing the favorites locally in our redux store, while the comments are being fetched from the server each time! And we haven't yet made postComment() to actually post it to the server like we did in React! When we do it, the comments will be persistent as well

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        favorites: state.favorites
    }
};

const mapDispatchToProps = dispatch => ({
    deleteFavorite: dishId => dispatch(deleteFavorite(dishId))
});

class Favorites extends React.Component {

    static navigationOptions = {
        title: 'My Favorites'
    }

    render() {
        const { navigate } = this.props.navigation;

        const renderMenuItem = ({ item, index }) => {

            const rightButton = [ // This is how we set up things for the Swipeout. We give an array of option buttons here (in this case just one button)
                {
                    text: 'Delete',
                    type: 'delete',
                    onPress: () => {
                        Alert.alert( // takes title, message, array of buttons and options
                            'Delete Favorite?',
                            'Are you sure you wish to delete the favorite dish ' + item.name + '?',
                            [ // array of buttons
                                { // cancel button
                                    text: 'Cancel', 
                                    onPress: () => console.log('Deletion of ' + item.name + ' was cancelled'),
                                    style: 'cancel'
                                },
                                { 
                                    text: 'OK', 
                                    onPress: () => this.props.deleteFavorite(item.id)
                                }
                            ], // and we can also have an additional param with options: 
                            { cancelable: false } // that means that for this alert dialog, the user either has to press "Cancel" explicitly or press "OK" explicitly. They can't just dismiss the dialogue. Note: @platform — android
                        );
                    }
                }
            ];

            return (
                <Swipeout right={rightButton} autoClose={true}>{/* Swipeout wraps an item in a list. autoclose - so when we click on a button, the Swipeout will close */}
                    <Animatable.View animation='fadeInRightBig' duration={400}>

                        <ListItem
                            key={index}
                            title={item.name}
                            subtitle={item.description}
                            hideChevron={true}
                            onPress={() => navigate('DishDetail', { dishId: item.id })}
                            leftAvatar={{ source: { uri: baseUrl + item.image } }}
                        />

                    </Animatable.View>
                </Swipeout>
            );
        }

        if (this.props.dishes.isLoading) {
            return (
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
            return (
                <View>
                    <Text>{this.props.dishes.errMess}</Text>
                </View>
            );
        }
        else {
            return (
                <FlatList 
                    data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(el => el === dish.id))}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                />
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);