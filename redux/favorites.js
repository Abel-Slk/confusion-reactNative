import * as ActionTypes from  './ActionTypes';

export const favorites = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.ADD_FAVORITE:
            if (state.some(el => el === action.payload)) // if the state array has some (any) elements which are the same as action.payload (ie if the action.payload element has already been added to favorites), then we don't need to do anything:
                return state;
            else 
                return state.concat(action.payload);
        
        default:
            return state;
    }
}