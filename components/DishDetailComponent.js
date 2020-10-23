import React from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable'; 

const mapStateToProps = state => ({
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
});
const mapDispatchToProps = dispatch => ({
    postFavorite: dishId => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))

});

function RenderDish(props) {

    const dish = props.dish;

    handleViewRef = ref => this.view = ref; // handleViewRef receives the reference as a parameter - a reference to a particular View. And then this variable view will be assigned that reference. I need the reference to the view in order to do an animation on that view programmatically
    // implemented as an arrow function - so 'this' points to the obj (/class) that DEFINED the function

    const recognizeRightToLeftDrag = ({ moveX, moveY, dx, dy }) => { // recognize a left to right gesture

        if (dx < -200) // the distance should be more than 200 in the negative direction (right to left) 
            return true;
        else 
            return false;

    };

    const recognizeLeftToRightDrag = gestureState => { // recognize comment
        if (gestureState.dx > 200)
            return true;
        else 
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => { 
            return true; // I set it up just to return true to indicate that this PanResponder is going to pick up the pan gesture and start responding to it
        },
        onPanResponderGrant: () => { // will be called when the PanResponder starts recognizing the pan gesture on the screen and it has been granted the permission to respond to it
            this.view.rubberBand(1000) //  perform the rubberBand animation on that particular view for one second 
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        // this rubberBand doesn't fit well though - it responds to ANY gesture - even small taps! So it's misleading and useless! Better remove it later or substitute it with sth more meaningful!
        },
        onPanResponderEnd: (e, gestureState) => { // invoked when the user lifts their finger off the screen after performing the gesture
        // we need to recognize that the gesture was done and also recognize what kind of gesture it is. So here, based upon the gestureState, I will be able to guess what kind of gesture the user has just performed
            if (recognizeRightToLeftDrag(gestureState))
                Alert.alert(
                    'Add to Favorites',
                    'Would you like to add ' + dish.name + ' to Favorites?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? alert('Already favorite!') : props.onPressing()
                        }
                    ],
                    { cancelable: false }
                )
            else if (recognizeLeftToRightDrag(gestureState))
                props.toggleModal();

            return true; // upon the completion of onPanResponderEnd() 
        }
    });

    const shareDish = (title, message, url) => {
        Share.share(
        { // content obj
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },
        { // options obj
            dialogTitle: 'Share ' + title
        }
        );
    }

    if (dish != null) {
        return (
            <Animatable.View animation='fadeInDown' duration={500} delay={0}
                ref={this.handleViewRef} // a reference to this View. Meaning this view will call this function handleViewRef() 
                {...panResponder.panHandlers} // All the handler functions (callback functions) that we have implemented will be added in to this View 
            >

                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>

                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>

                    <View style={styles.icons}>
                        <Icon 
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite!') : props.onPressing()}
                        />

                        <Icon 
                            raised
                            reverse
                            name={'pencil'} 
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.toggleModal()}
                        />

                        <Icon 
                            raised
                            reverse
                            name={'share'}
                            type='font-awesome'
                            color='#51D2A8'
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                        />
                    </View>
                    
                </Card>
            </Animatable.View>
            
            
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
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>

                <Rating style={styles.ratingsInTheCommentsList} 
                    imageSize={15} 
                    readonly 
                    startingValue={item.rating} 
                />

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
        <Animatable.View animation='fadeInUp' duration={500} delay={0}>

            <Card title="Comments">
                <FlatList 
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>

        </Animatable.View>
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

    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal = () => { // had to implement it as an ARROW function so that 'this' would always point to the obj (/class) that DEFINED this function - ie to DishDetail!
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
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish 
                    dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPressing={() => this.markFavorite(dishId)}
                    toggleModal={() => this.toggleModal()}
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
                        <Rating style={{ paddingVertical: 10 }}
                            showRating
                            startingValue={this.state.rating}
                            onFinishRating={rating => this.ratingCompleted(rating)}
                        />

                        <View style={styles.modalRow}>
                            <Input style={styles.modalText}
                                placeholder="Author"
                                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                leftIconContainerStyle = {{marginLeft:0, marginRight: 15}}
                                onChangeText={value => this.setState({ author: value })}
                            />
                        </View>

                        <View style={styles.modalRow}>
                            <Input style={styles.modalText}
                                placeholder="Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                leftIconContainerStyle = {{ marginLeft:0, marginRight: 15}}
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
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalRow: {
        marginTop: 15, 
        marginBottom: 15 
    },
    modalText: {
        fontSize: 18,
        margin: 10
    },
    ratingsInTheCommentsList: {
        alignItems: 'flex-start',
        paddingTop: 7,
        paddingBottom: 7
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);