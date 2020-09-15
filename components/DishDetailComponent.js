import React from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => ({
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
});
const mapDispatchToProps = dispatch => ({
    postFavorite: dishId => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))

});

function RenderDish(props) { // tried changing to an arrow function to try to solve setting parent state issue - same error
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

                <View style={styles.icons}>
                    <Icon 
                        raised // raised for the Icon displays the Icon in the form of a button, a rounded button. An interesting way of using it
                        reverse // reverse will reverse the color. So Icon itself will be of one color, and then the reverse color will be shown to the surrounding part in the icon there
                        name={props.favorite ? 'heart' : 'heart-o'}// Icon's name attr defines the icon pic. if it is a favorite then I will render a field, heart, to indicate that this is already a favorite dish. If it is not a favorite, I will render a heart with just the outline
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite!') : props.onPressing()}// Icon has an attr onPress. when I press that, I'll check to see if this is already my favorite dish. if it is,  I will simply say 'Already favorite'. Otherwise I'll call props.onPressing() which we passed to RenderDish
                    />

                    <Icon 
                        raised
                        reverse
                        name={'pencil'}// Icon's name attr takes the shortest name! The full FA name is 'fas fa-pencil'!! 
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.toggleModal()}// also already tried {props.toggleModal} to have it exactly like at https://ourcodeworld.com/articles/read/409/how-to-update-parent-state-from-child-component-in-react - but it looks more like () => props.toggleModal() is correct (see post by alyn000r at https://stackoverflow.com/questions/33720405/react-native-how-to-pass-this-setstate-change-to-parent)
                    />
                </View>
                
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

        this.state = { // we'll store this state locally for now
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        }

        // this.toggleModal = this.toggleModal.bind(this); // binding is not necessary in React Native? Everything seems to work without it?
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal = () => { // VERY IMPORTANT NOTE: had to implement it as an ARROW function so that 'this' would always point to the obj (/class) that DEFINED this function - ie to DishDetail!
    // Detailed explanation: initially I had this method just like all others - as a regular function - as toggleModal() {...} - but this resulted in the error "undefined is not an object - this.state.showModal". The thing here is that toggleModal() is DishDetail's method - but we're actually using it in DishDetail's child, RenderDish: we pass toggleModal() to the child (RenderDish) to then change the PARENT's (DishDetail's) state from inside the child! And in regular functions 'this' references the object (in our case class) that CALLS the function (see 2_arrow_functions.js). So when we call a REGULAR toggleModal() from inside the child, 'this' points to the child - RenderDish! BUT - if we implement toggleModal() as an ARROW function, 'this' will always be pointing to the object that DEFINED the function!! Ie the parent - DishDetail!!
    // Also see Thai Duong Tran's answer at https://stackoverflow.com/questions/50713037/react-native-composite-component-calling-setstate-of-the-parent-from-a-child-com
        this.setState({ showModal: !this.state.showModal }); 
    }

    ratingCompleted(receivedRating) {
        this.setState({ rating: receivedRating });
    }

    handleSubmit(dishId) {
        console.log(JSON.stringify(this.state));

        this.toggleModal(); 
        this.resetForm();

        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
    }

    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        });
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
                    toggleModal={() => this.toggleModal()}// {() => this.toggleModal()} and {this.toggleModal} seem to both work the same here 
                />

                <RenderComments comments={this.props.comments.comments.filter(comment => comment.dishId === dishId)} />


                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.resetForm()}
                    onRequestClose={() => this.resetForm()}
                >
                    <View style={styles.modal}>
                        <Rating style={{ paddingVertical: 10 }}// just to put some space above the rating
                            showRating
                            onFinishRating={rating => this.ratingCompleted(rating)}
                        />

                        <View style={styles.modalRow}>
                            <Input style={styles.modalText}
                                placeholder="Author"
                                leftIcon={{ type: 'font-awesome', name: 'user' }}
                                leftIconContainerStyle = {{marginLeft:0, marginRight: 15}}//had a propblem with leftIcon - it was positioned incorrectly - mb due to the version of RNE being too old and FA being too new?Either way - solved it as suggested here https://stackoverflow.com/questions/59189461/react-naitve-element-input-left-icon-displaced - added this leftIconContainerStyle attr and adjusted the margins myself

                                onChangeText={value => this.setState({ author: value })}
                            />
                        </View>

                        <View style={styles.modalRow}>
                            <Input style={styles.modalText}
                                placeholder="Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment' }}
                                leftIconContainerStyle = {{marginLeft:0, marginRight: 15}}
                                onChangeText={value => this.setState({ comment: value })}
                            />
                        </View>
 
                        <View style={styles.modalRow}>
                            <Button 
                                title='Submit'
                                color='#512DA8'
                                onPress={() => this.handleSubmit(dishId)}
                                accessibilityLabel='Submit'
                            />
                        </View>

                        <View style={styles.modalRow}>
                            <Button 
                                title='Cancel'
                                color='#FA0'
                                onPress={() => this.toggleModal()}
                                accessibilityLabel='Cancel'
                            />
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    icons: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    // formLabel: {
    //     fontSize: 18,
    //     flex: 2
    // },
    // formItem: {
    //     flex: 1
    // },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalRow: {
        marginTop: 15, 
        marginBottom: 15 
        // initially also had flex: 1 here - but it messes up Input's layout! it looks like Input already has it all figured out behind the scenes! So I only made small changes - just increased margins
    },
    // modalTitle: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     backgroundColor: '#512DA8',
    //     textAlign: 'center',
    //     color: 'white',
    //     marginBottom: 20
    // },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);