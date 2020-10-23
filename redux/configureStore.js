import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { dishes } from './dishes';
import { comments } from './comments';
import { promotions } from './promotions';
import { leaders } from './leaders';
import { favorites } from './favorites';
import { persistStore, persistCombineReducers } from 'redux-persist'; // for persistence across app restart
import storage from 'redux-persist/es/storage'; // access to the local storage on our device

export const ConfigureStore = () => {

    const config = { // the config obj for redux-persist
        key: 'root',
        storage, // use the imported storage 
        debug: true // print debug info
    };

    const store = createStore(
        persistCombineReducers(config, { // instead of combineReducers. Note that we've added an extra param to the beginning - config as the first param
            dishes, 
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
