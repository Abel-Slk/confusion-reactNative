import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import { DISHES } from '../shared/dishes';

// View is a container for a set of information
// React Native uses NATIVE components instead of web components in building the view. So instead of using typical HTML-like elements that we did with React, we'll be using built-in React Native components which are mapped into corresponding native UI widgets in both Android and iOS. ex Text is mapped into the text-view component in Android and into the UI-text in iOS. So when you encounter any of the components in React Native, they would have a correspondence with the corresponding Native component in both Android and iOS



// I'm going to make each of these components store their own state, and the reason, as I said, is later on I will implement a redux support for this application. Then I will simply connect each of these components directly to the reduxes too. This is one way of implementing it. Now, in the react course earlier, I had one main component which was the only one that was connected to the redux store. These are Two different ways of implementing how you interact with the redux store. Again, hold on to that thought, we'll come back to that in the next module. all the components will have the same state simply because this dishes is a shared object that we are importing. And so they will all have the same state anyway.


function RenderDish(props) {
    const dish = props.dish;
    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={require('./images/uthappizza.png')}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
            </Card>
            
            
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

class DishDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dishes: DISHES
        };
    }

    static navigationOptions = { 
        title: 'Dish Details' 
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', ''); // navigation.getParam() allows me to access the params that are passed into the component. getParam takes as the first parameter the name that we configured for the parameter in the menu component in navigate(). and then we'll also specify a default fallback option here - an empty string there

        return (
            <RenderDish dish={this.state.dishes[+dishId]} />// I need to select the dish for which the dishId is what I have obtained as the incoming parameter above. putting a + before dishId (which is a string) will turn that in to the equivalent number there, and so that I will use as the index in to the dishes here
        );
    }
}

export default DishDetail;