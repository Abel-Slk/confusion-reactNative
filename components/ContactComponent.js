import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

function Contact() {
    return (
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
    );
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