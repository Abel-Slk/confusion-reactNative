import { connect } from "react-redux";

export const DISHES_LOADING = 'DISHES_LOADING';
export const DISHES_FAILED = 'DISHES_FAILED';
export const ADD_DISHES = 'ADD_DISHES';

export const PROMOS_LOADING = 'PROMOS_LOADING';
export const PROMOS_FAILED = 'PROMOS_FAILED';
export const ADD_PROMOS = 'ADD_PROMOS';

export const LEADERS_LOADING = 'LEADERS_LOADING';
export const LEADERS_FAILED = 'LEADERS_FAILED';
export const ADD_LEADERS = 'ADD_LEADERS';

export const COMMENTS_FAILED = 'COMMENTS_FAILED';
export const ADD_COMMENTS = 'ADD_COMMENTS'; // fetch from the server
export const ADD_COMMENT = 'ADD_COMMENT'; // add a submitted comment

export const ADD_FAVORITE = 'ADD_FAVORITE'; // when the server gets updated by POST_FAVORITE, then we ADD_FAVORITE to our redux store (and display it in the UI)

// export const POST_FAVORITE = 'POST_FAVORITE'; // Muppala wrote this - but we never used it!! And we didn't have POST action types in our React app either! 
