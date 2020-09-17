import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable'; 

class Contact extends React.Component { // even though we don't need constr with state here, still had to implement this as a class - to be able to put static navigationOptions in it!

  static navigationOptions = { 
    title: 'Contact Us' 
  };

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