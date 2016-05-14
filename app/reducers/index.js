import { combineReducers } from 'redux';

import GA from '../plugins/GA/reducers';
// right here list of all reducers


const rootReducer = combineReducers({
	GA
});

export default rootReducer;