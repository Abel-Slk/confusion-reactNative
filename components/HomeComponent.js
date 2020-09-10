import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { PROMOTIONS } from '../shared/promotions';
import { LEADERS } from '../shared/leaders';

function RenderItem(props) {
    const item = props.item; // this actually makes the whole code below more reusable! Ex if we change later where we get the value for the item from, we'll have to edit only this line, and not all instances of item in the code below!

    if (item != null) {
        return (
            <Card
                featuredTitle={item.name}
                featuredSubtitle={item.designation}// only leaders have designation, dishes and promotions don't. So this particular subtitle will be rendered only when the designation is not null. Otherwise it will not be rendered, which works just fine for us. (Interesing though that this wasn't enough for us in React - there we had to explicitly write what to do depending on whether designation is or is not null! But there designation was implemented as the content of a component, while here it's the value of an attr of a component - so these little implementation differences might require a bit different code?..)
                image={require('./images/uthappizza.png')}
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

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dishes: DISHES,
            promotions: PROMOTIONS,
            leaders: LEADERS
        }
    }

    static navigationOptions = { 
        title: 'Home' 
    };

    render() {
        return (
            <ScrollView>
                <RenderItem item={this.state.dishes.filter(dish => dish.featured)[0]} />
                <RenderItem item={this.state.promotions.filter(promo => promo.featured)[0]} />
                <RenderItem item={this.state.leaders.filter(leader => leader.featured)[0]} />
            </ScrollView>
        );
    }
}

export default Home;