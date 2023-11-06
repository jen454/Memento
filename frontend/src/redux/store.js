import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import userReducer from './user_reducer';

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers if needed
});

const middleware = []; // Add middleware if needed

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;