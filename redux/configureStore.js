import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { dishes } from './dishes';
import { comments } from './comments';
import { promotions } from './promotions';
import { leaders } from './leaders';
import { favorites } from './favorites';
import { persistStore, persistCombineReducers } from 'redux-persist'; // Redux Persist itself can be used even with a React application, a react web application if you so choose to. But typically the persistence across app restart is more of the concern in a mobile application, than a web application. Typically for a web application we assume that we are connected to the Internet and we should be able to refresh the state of the application. But with a mobile device you may be off the network sometimes. And you may still, when you restart your app, at least you want to give the user at least a minimum user experience with minimum amount of information displayed within your app. So this is where the persistence of the Redux tool enables you to add in offline support for your application
import storage from 'redux-persist/es/storage'; // So this will give access to the local storage on our device

export const ConfigureStore = () => {

    const config = { // the config obj for redux-persist
        key: 'root',
        storage, // We will use the storage that we have just imported
        debug: true // to print debug info
    };

    const store = createStore(
        persistCombineReducers(config, { // instead of combineReducers. Note that we've added an extra param to the beginning - config as the first param
            dishes, // short for dishes: dishes 
            comments,
            promotions,
            leaders,
            favorites
        }),
        applyMiddleware(thunk, logger)
    );

    const persistor = persistStore(store)

    return { persistor, store }; // instead of just return store;
}
