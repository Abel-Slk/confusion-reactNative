import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

// if reloading the app is not updating it, try to quit the server and then do yarn start again

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

