// store.js

import { createStore } from 'redux';
import rootReducer from './reducer'; // Update import path to match your file structure

const store = createStore(rootReducer);

export default store;