import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';

// View is a container for a set of information. https://reactnative.dev/docs/view
// React Native uses NATIVE components instead of web components in building the view. So instead of using typical HTML-like elements that we did with React, we'll be using built-in React Native components which are mapped into corresponding native UI widgets in both Android and iOS. ex Text is mapped into the text-view component in Android and into the UI-text in iOS. So when you encounter any of the components in React Native, they would have a correspondence with the corresponding Native component in both Android and iOS



// I'm going to make each of these components store their own state, and the reason, as I said, is later on I will implement a redux support for this application. Then I will simply connect each of these components directly to the redux store. This is one way of implementing it. Now, in the react course earlier, I had one main component which was the only one that was connected to the redux store. These are Two different ways of implementing how you interact with the redux store. Again, hold on to that thought, we'll come back to that in the next module. all the components will have the same state simply because this dishes is a shared object that we are importing


function RenderDish(props) {
    const dish = props.dish;
    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={require('./images/uthappizza.png')}
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
    constructor(props) {
        super(props);

        this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites: [] // as I select dishes and mark them as favorites, then they will be added into the favorites array. And then I can use the favorites array to check to see if my dish is a favorite dish or not
        };
    }

    markFavorite(dishId) {
        this.setState({ favorites: this.state.favorites.concat(dishId) });
    }

    static navigationOptions = { 
        title: 'Dish Details' 
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', ''); // navigation.getParam() allows me to access the params that are passed into the component. getParam takes as the first parameter the name that we configured for the parameter in the menu component in navigate(). and then we'll also specify a default fallback option here - an empty string there

        return (
            <ScrollView>
                <RenderDish 
                    dish={this.state.dishes[+dishId]}// I need to select the dish for which the dishId is what I have obtained as the incoming parameter above. putting a + before dishId (which is a string) will turn that in to the equivalent number there, and so that I will use as the index in to the dishes here 
                    favorite={this.state.favorites.some(el => el === dishId)}// favorite will be true or false. some() returns true if there exists an item (at least one) in the array for which the callback function inside some() returns true. So I will check every element in this array to see if that element Is the same as dishId. And favorite will be true if dishId already exists in favorites
                    onPressing={() => this.markFavorite(dishId)}
                />

                <RenderComments comments={this.state.comments.filter(comment => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

export default DishDetail;