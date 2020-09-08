import React from 'react';
import Menu from './MenuComponent';
import { DISHES } from '../shared/dishes';
import DishDetail from './DishDetailComponent';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dishes: DISHES,
            selectedDish: null
        }

        // this.onDishSelect = this.onDishSelect.bind(this); // not necessary??
    }

    onDishSelect(dishId) { // we don't need to bind it in the constr?? Muppala didn't - and I tried with and without binding - works the same!!
        this.setState({selectedDish: dishId});
    }

    render() {
        return (
            <ScrollView>{/* initially had <View style={{flex: 1}}> here - just sth to enclose stuff into cause we have multiple elements here (like we did with React.Fragment in React) - but View didn't allow to scroll content! (Muppala didn't notice this cause he was testing on a tablet where everything was fitting the screen!) ScrollView seems to be pretty much the same as View (it inherits Views props) - but it does allow scrolling! See http://reactnative.dev/docs/scrollview */}
            {/* Note: this is a temp solution - throws a warning about ScrollView conflicting with Flatlist - and better make the links go to other pages/view - cause otherwise unless you scroll down you won't see the dish! This gotta be reworked! Just gotta move opening the card on press to a diff view! And then can change ScrollView back to view - and then the conflict between ScrollView and FlatList with be solved! */}
                <Menu dishes={this.state.dishes}
                onPressing={dishId => this.onDishSelect(dishId)} />
                {/* we're just passing this onPress function to the Menu to use it there. Note that we're defining onPress to be a function that takes one param - dishId. So when we'll actually be calling onPress, we'll need to call it with an arg - as onPress(dishIdArg)! And so We'll use it in Menu in <ListItem onPress={() => props.onPress(item.id)}. calling onPress(item.id) sets the value of the dishId param to be item.id */}
                {/* I guess we need to define this function in Main, not in Menu, cause we're using onDishSelect() which is modifying the state! */}
                {/* see comment to onPress in Menu!! */}

                <DishDetail dish={this.state.dishes.filter(dish => dish.id === this.state.selectedDish)[0]}/>
            {/* </View> */}
            </ScrollView>
            
        );
    }
}