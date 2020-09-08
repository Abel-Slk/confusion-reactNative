import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-elements';

// View is a container for a set of information
// React Native uses NATIVE components instead of web components in building the view. So instead of using typical HTML-like elements that we did with React, we'll be using built-in React Native components which are mapped into corresponding native UI widgets in both Android and iOS. So ex if you use a Text component, it'll be mapped into the text-view component in Android and into the UI-text in iOS. So when you encounter any of the components in React Native, they would have a correspondence with the corresponding Native component in both Android and iOS


function RenderDish(props) {
    const dish = props.dish;
    if (dish != null) {
        return (
            <Card>
                <Card.Title>{dish.name}</Card.Title>

                <Card.Image source={require('./images/uthappizza.png')}>
                
                </Card.Image>
                <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                
            </Card>
        );
    }
    else {
        return (<View></View>);
    }
}

function DishDetail(props) {
    return (
        <RenderDish dish={props.dish} />
    );
}

export default DishDetail;