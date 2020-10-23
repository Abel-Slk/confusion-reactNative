import React from 'react';
import { SafeAreaView, View, Text, FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import * as Animatable from 'react-native-animatable'; 

const mapStateToProps = state => {
    return {
        dishes: state.dishes
    }
}

class Menu extends React.Component {

    static navigationOptions = { 
        title: 'Menu' 
    };

    render() {

        const { navigate } = this.props.navigation; 

        const renderMenuItem = ({ item, index }) => ( 
            <Animatable.View animation='fadeInRightBig' duration={500}>

                <Tile // reworked ListItem into a Tile component
                    key={index}
                    title={item.name}
                    caption={item.description}
                    featured 
                    imageSrc={{ uri: baseUrl + item.image }} 
                    onPress={() => navigate('DishDetail', { dishId: item.id })}
                />
                
            </Animatable.View>
        );

        if (this.props.dishes.isLoading) {
            return (
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
            return (
                <View>
                    <Text>{this.props.leaders.errMess}</Text>
                </View>
            );
        }
        else {
            return (
                <FlatList
                    data={this.props.dishes.dishes} 
                    renderItem={renderMenuItem} 
                    keyExtractor={item => item.id.toString()} 
                />
            );
        }
    }
  
}

export default connect(mapStateToProps)(Menu);