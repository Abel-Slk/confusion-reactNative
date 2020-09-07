import React from 'react';
import Main from './components/MainComponent';

// if reloading the app is not updating it, try to quit the server and then do yarn start again

export default function App() {
  return (
    <Main />
    // <View >{/* View is a container for a set of information*/}
    //   <Text>Open up App.js to start working on your app!</Text>
    //   {/* React Native uses NATIVE components instead of web components in building the view. So instead of using typical HTML-like elements that we did with React, we'll be using built-in React Native components which are mapped into corresponding native UI widgets in both Android and iOS. So ex if you use a Text component, it'll be mapped into the text-view component in Android and into the UI-text in iOS. So when you encounter any of the components in React Native, they would have a correspondence with the corresponding Native component in both Android and iOS */}
    //   <StatusBar style="auto" />
    // </View>
  );
}


