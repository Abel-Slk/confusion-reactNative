import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => ({
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
});
const mapDispatchToProps = dispatch => ({
    postFavorite: dishId => dispatch(postFavorite(dishId))
});

function RenderDish(props) {
    const dish = props.dish;
    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}
            >
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>

                <Icon 
                    raised // raised for the Icon displays the Icon in the form of a button, a rounded button. An interesting way of using it
                    reverse // reverse will reverse the color. So Icon itself will be of one color, and then the reverse color will be shown to the surrounding part in the icon there
                    name={props.favorite ? 'heart' : 'heart-o'}// Icon's name attr defines the icon pic. if it is a favorite then I will render a field, heart, to indicate that this is already a favorite dish. If it is not a favorite, I will render a heart with just the outline
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite!') : props.onPressing()}// Icon has an attr onPress. when I press that, I'll check to see if this is already my favorite dish. if it is,  I will simply say 'Already favorite'. Otherwise I'll call props.onPressing() which we passed to RenderDish
                />
            </Card>
            
            // same using the latest version of react-native-elements:
            // <Card>
            //     <Card.Title>{dish.name}</Card.Title>

            //     <Card.Image source={require('./images/uthappizza.png')}>
                
            //     </Card.Image>
            //     <Text style={{margin: 10}}>
            //             {dish.description}
            //     </Text>
            // </Card>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>{/* key cause it'll be a list item in a FlatList! */}
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>
                    {'-- ' + item.author + '   ' + 
                    new Intl.DateTimeFormat('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: '2-digit'
                        }).format(new Date(Date.parse(item.date)))
                    }
                </Text>
            </View>
        );
    }

    return (
        <Card title="Comments">
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends React.Component {

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = { 
        title: 'Dish Details' 
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', ''); // navigation.getParam() allows me to access the params that are passed into the component. getParam takes as the first parameter the name that we configured for the parameter in the menu component in navigate(). and then we'll also specify a default fallback option here - an empty string there

        return (
            <ScrollView>
                <RenderDish 
                    dish={this.props.dishes.dishes[+dishId]}// I need to select the dish for which the dishId is what I have obtained as the incoming parameter above. putting a + before dishId (which is a string) will turn that in to the equivalent number there, and so that I will use as the index in to the dishes here 
                    favorite={this.props.favorites.some(el => el === dishId)}// favorite will be true or false. some() returns true if there exists an item (at least one) in the array for which the callback function inside some() returns true. So I will check every element in this array to see if that element Is the same as dishId. And favorite will be true if dishId already exists in favorites
                    onPressing={() => this.markFavorite(dishId)}
                />

                <RenderComments comments={this.props.comments.comments.filter(comment => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);