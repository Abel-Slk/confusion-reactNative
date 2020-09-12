import * as React from 'react';
import { ScrollView,Text, View, StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { ListItem, Button, Card, Avatar } from 'react-native-elements';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
const History = () => {
  let [data, setData] = useState(null);
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=5')
      .then((response) => response.json())
      .then((json) => setData(json.results));
  }, []);
  const keyExtractor = (item, index) => index.toString();
  return (
    <ScrollView>
      <Card>
        <Card.Title>Our History</Card.Title>
        <Text>
          Started in 2010, Ristorante con Fusion quickly established itself as a
          culinary icon par excellence in Hong Kong. With its unique brand of
          world fusion cuisine that can be found nowhere else, it enjoys
          patronage from the A-list clientele in Hong Kong. Featuring four of
          the best three-star Michelin chefs in the world, you never know what
          will arrive on your plate the next time you visit us.
        </Text>
        <Text style={{marginTop: 10}}>
          The restaurant traces its humble beginnings to The Frying Pan, a
          successful chain started by our CEO, Mr. Peter Pan, that featured for
          the first time the world's best cuisines in a pan.
        </Text>
      </Card>
      <Card>
        <Card.Title>Corporate Leadership</Card.Title>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={data}
          renderItem={({ item }) => (
            <View>
              <ListItem bottomDivider>
                <Avatar rounded source={{ uri: `${item.picture.large}` }} />
                <ListItem.Content>
                  <ListItem.Title>{item.name.first}</ListItem.Title>
                  <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </View>
          )}></FlatList>
      </Card>
    </ScrollView>
  );
};
const AboutComponent = () => {
  return <History />;
};

export default AboutComponent;
