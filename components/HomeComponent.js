import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        promotions: state.promotions,
        leaders: state.leaders
    }
}

function RenderItem(props) {
    const item = props.item; // this actually makes the whole code below more reusable! Ex if we change later where we get the value for the item from, we'll have to edit only this line, and not all instances of item in the code below!

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

class Home extends React.Component {

    static navigationOptions = { 
        title: 'Home' // this will show the title in the header of the view
    };

    render() {
        return (
            <ScrollView>
                <RenderItem item={this.props.dishes.dishes.filter(dish => dish.featured)[0]} />
                <RenderItem item={this.props.promotions.promotions.filter(promo => promo.featured)[0]} />
                <RenderItem item={this.props.leaders.leaders.filter(leader => leader.featured)[0]} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);