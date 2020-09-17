import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        promotions: state.promotions,
        leaders: state.leaders
    }
}

function RenderItem(props) {
    const item = props.item; // this actually makes the whole code below more reusable! Ex if we change later where we get the value for the item from, we'll have to edit only this line, and not all instances of item in the code below!

    if (props.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.errMess) {
        return (
            <Text>{props.errMess}</Text>
        );
    }
    else {
        if (item != null) {
            return (
                <Card
                    featuredTitle={item.name}
                    featuredSubtitle={item.designation}// only leaders have designation, dishes and promotions don't. So this particular subtitle will be rendered only when the designation is not null. Otherwise it will not be rendered, which works just fine for us. (Interesing though that this wasn't enough for us in React - there we had to explicitly write what to do depending on whether designation is or is not null! But there designation was implemented as the content of a component, while here it's the value of an attr of a component - so these little implementation differences might require a bit different code?..)
                    image={{ uri: baseUrl + item.image }}
                >
                    <Text style={{margin: 10}}>
                            {item.description}
                    </Text>
                </Card>
            );
        }
        else {
            return (<View></View>);
        }
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.animatedValue = new Animated.Value(0); // this is an animated value type which is used by the animated API in order to perform certain operations
    }

    static navigationOptions = { 
        title: 'Home' // this will show the title in the header of the view
    };

    componentDidMount() {
        this.animate();
    }

    animate() {
        this.animatedValue.setValue(0);
        Animated.timing( // Animated.timing() enables us to take this animatedValue and change it as a function of time
            this.animatedValue, // first param - the value
            
            { // second param - config - HOW we want to change that value as a function of time:
                toValue: 8, // go from 0 to 8
                duration: 8000,
                easing: Easing.linear // Easing says how to change this value - change this value linearly or change this value by using easing in (start slowly and then finish quickly), or easing out and so on
            }
        ).start(() => this.animate());   // Animations are started by calling start() on your animation. start() takes a completion callback (optional) that will be called when the animation is done.
        // I will ask it to go back and redo the same thing. meaning that at the end of this change of the value, I'll restart the whole thing. So, this is like we are looping through these changes continuously
    }

    render() {
        const xpos1 = this.animatedValue.interpolate({ // as the value changes, this'll map that value to a corresponding different value here
            inputRange: [0, 1, 3, 5, 8], // this is something that I figured out by trial and error adjusting these numbers until I got an animation that looked reasonably good. (so he took the range of 0-8 and broke it into intervals)
            outputRange: [1200, 600, 0, -600, -1200] // so if the value is 0, it will be mapped into 1200, 1 to 600, etc.

        }); 

        const xpos2 = this.animatedValue.interpolate({ // we'll use xpos2 for the animation of the second card
            inputRange: [0, 2, 4, 6, 8], 
            outputRange: [1200, 600, 0, -600, -1200] 

        }); 

        const xpos3 = this.animatedValue.interpolate({ 
            inputRange: [0, 3, 5, 7, 8], 
            outputRange: [1200, 600, 0, -600, -1200]

        }); 

        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos1 }] }}>{/* instead of ScrollView now - don't need that anymore cause we're scrolling content horizontally using animation */}
                {/* transform is where I specify what kind of transformation I want to apply to this Animated.View. The transform itself takes an array of objects that I want to transform */}
                {/* translateX: xpos1 - So as a function of time, the x position of whatever is inside this Animated.View will be changed as per how the xpos1 changes. So initially it will be 1200, then it will become 600, 0, -600, and -1200. 1200 would be off the screen to the right, 600 would still be off the screen to the right, 0 is right in the middle of the screen, and then -600 and -1200 would be on the left. So, this card will slowly come onto this screen from the right and then go across the screen and then disappear to the left. */}
                {/* translateX applies xpos1 to the x position of the top left corner of the Card in RenderItem */}
                    <RenderItem 
                        item={this.props.dishes.dishes.filter(dish => dish.featured)[0]}
                        isLoading={this.props.dishes.isLoading}
                        errMess={this.props.dishes.errMess}
                    />
                </Animated.View>
               
                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos2 }] }}>
                    <RenderItem 
                        item={this.props.promotions.promotions.filter(promo => promo.featured)[0]} 
                        isLoading={this.props.promotions.isLoading}
                        errMess={this.props.promotions.errMess}
                    />
                </Animated.View>

                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos3 }] }}>
                    <RenderItem 
                        item={this.props.leaders.leaders.filter(leader => leader.featured)[0]} 
                        isLoading={this.props.leaders.isLoading}
                        errMess={this.props.leaders.errMess}
                    />
                </Animated.View>
                
                
            </View>
        );
    }
}

export default connect(mapStateToProps)(Home);