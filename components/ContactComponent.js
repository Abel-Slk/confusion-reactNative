import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable'; 
// import { MailComposer } from 'expo'; 
import * as MailComposer from 'expo-mail-composer';

class Contact extends React.Component { // even though we don't need constr with state here, still had to implement this as a class - to be able to put static navigationOptions in it!

  static navigationOptions = { 
    title: 'Contact Us' 
  };

  sendMail() {
    MailComposer.composeAsync({
      recepients: ['confusion@food.net'], // array of recepients
      subject: 'Enquiry',
      body: 'To whom it may concern:'
    });
  }

  render() {
    return (
      <ScrollView>

        <Animatable.View animation='fadeInDown' duration={500} delay={0}>

          <Card title='Contact Information'>
            <Text>
                <Text style={styles.subtitleText}>Our Address</Text>
                {'\n'}
                <Text style={styles.baseText}>
                    121, Clear Water Bay Road{'\n'}
                    Clear Water Bay, Kowloon{'\n'}
                    HONG KONG{'\n'}
                    Tel: +852 1234 5678{'\n'}
                    Fax: +852 8765 4321{'\n'}
                    Email:confusion@food.net
                </Text>
            </Text> 

            <Button // this button is from react-native elements, and this is an enhanced button than the button that we use from react-native. This allows me to even specify the icon to be used in the button
              title='  Send Email'
              buttonStyle={{ backgroundColor: '#512DA8', marginTop: 30 }}
              icon={<Icon type='font-awesome' name='envelope-o' color='white' />}
              onPress={this.sendMail}
            />
          </Card>

        </Animatable.View>
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    lineHeight: 30
  },
  subtitleText: {
    fontWeight: "bold"
  }
});
  
export default Contact;