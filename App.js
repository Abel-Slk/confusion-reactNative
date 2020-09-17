import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react'; // integration with React / React Native
import { Loading } from './components/LoadingComponent';

const { persistor, store } = ConfigureStore(); // instead of const store 

// if reloading the app is not updating it, try to quit the server and then do yarn start again

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate // takes two attributes: first the loading attr where we supply a component that will display the loading message on the screen, and the persistor
        loading={<Loading />}
        persistor={persistor}
      >
        <Main />
      </PersistGate>
    </Provider>
  );
}

