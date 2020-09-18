import React from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder } from 'react-native';
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
        // in onPanResponderEnd() we're passing the gestureState obj as an arg to recognizeRightToLeftDrag(). Now, gestureState itself contains properties from which we can extract the ones that are of interest to us - we'll extract the four properties that we'll use to recognize the gesture. 
        // So this is allowed? We define recognizeRightToLeftDrag() to receive exactly those four params - but pass it one obj - and JS doesn't crash but manages to find those 4 params in the properties of that obj! Goddamn didn't think JS allows that!

        // MoveX and moveY are the latest screen coordinates of the recently moved touch gesture. dx is the accumulated distance of the gesture along the X direction. So if you touch the screen at one point and then drag across and then lift, The distance travelled is given by dx and dy. dx along the X axis and dy along the Y axis. 

        // here I am going to recognize only the right to left gesture on the screen. So I'll just look at the dx value. the way distances are measured, the coordinates always start at the TOP-LEFT corner (0:0 there). So a distance traveled from left to right (in the positive direction) will be positive, and from right to left (in the negative direction) will have a negative value. So if dx < -200 (a distance of 200 in the NEGATIVE direction - in the RIGHT TO LEFT direction), then I will return a true to indicate that indeed this was a right to left pan gesture that the user did. And along the Y direction, we don't really care
        if (dx < -200) // and the distance should be more than 200 in the negative direction (right to left) - so it starts getting recognized only when the swipe is long enough
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

    const panResponder = PanResponder.create({ // takes a config obj where we supply various callbacks for the panResponder
    // see also: http://reactnative.dev/docs/panresponder.html
        onStartShouldSetPanResponder: (e, gestureState) => { // This function will be called when the user's gesture begins on the screen
        // gestureState contains information that we can use to recognize various aspects about the actual pan gesture that the user does on the screen 
            return true; // I set it up just to return true to indicate that this PanResponder is going to pick up the pan gesture and start responding to it
        },
        onPanResponderGrant: () => { // will be called when the PanResponder starts recognizing the pan gesture on the screen and it has been granted the permission to respond to it
            this.view.rubberBand(1000) //  perform the rubberBand animation on that particular view for one second. This will return a promise. The value that the promise resolves with (called endState in our code) is basically whether the animation was performed or not - and we can print that if we want: 
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        // this rubberBand doesn't fit well though - it responds to ANY gesture - even small taps! So it's misleading and useless! Better remove it later or substitute it with sth more meaningful!
        },
        onPanResponderEnd: (e, gestureState) => { // this one will be invoked when the user lifts their finger off the screen after performing the gesture. at this point we also receive event and gestureState as args
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

            return true; // upon the completion of onPanResponderEnd() (note that it's different from having else in front of it - cause with else it would mean execute this ONLY IF all the prev conditions were not met - but here we say to return true in the end EITHER WAY - regardless of whether any conditions were met above! And notice that usually when we have else return false, we also have return statements inside each if/else if! But here we have a return only at the very end! So it doesn't really mean else here!)
        }
    });

    if (dish != null) {
        return (
            <Animatable.View animation='fadeInDown' duration={500} delay={0} // fadeInDown for RenderDish and fadeInUp for RenderComments - so that they would move towards each other from top and bottom
                ref={this.handleViewRef} // a reference to this View. Meaning this view will call this function handleViewRef() (--though couldn't we just pass a function to be invoked with View in a more simple way? But then, there's no onPress stuff - we need to fire a function on its loading... So mb that's the way...)
                {...panResponder.panHandlers} // All the handler functions (callback functions) that we have implemented will be added in to this View (spread thouse panHandlers!) Now, any gesture that you do on this View, the panHandlers are supposed to handle that gesture
            >

                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>

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
                            onPress={() => props.toggleModal()}
                        />
                    </View>
                    
                </Card>
            </Animatable.View>
            
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

                {/* <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text> */}
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
        // alt can get it as  const dishId = this.props.route.params.dishId;? One of the guys had it like that

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
                            startingValue={this.state.rating}
                            onFinishRating={rating => this.ratingCompleted(rating)}
                        />

                        <View style={styles.modalRow}>
                            <Input style={styles.modalText}
                                placeholder="Author"
                                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                leftIconContainerStyle = {{marginLeft:0, marginRight: 15}}//had a propblem with leftIcon - it was positioned incorrectly - mb due to the version of RNE being too old and FA being too new?Either way - solved it as suggested here https://stackoverflow.com/questions/59189461/react-naitve-element-input-left-icon-displaced - added this leftIconContainerStyle attr and adjusted the margins myself

                                onChangeText={value => this.setState({ author: value })}
                            />
                        </View>

                        <View style={styles.modalRow}>
                            <Input style={styles.modalText}
                                placeholder="Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
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
    },
    ratingsInTheCommentsList: {
        alignItems: 'flex-start',
        paddingTop: 7,
        paddingBottom: 7
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);