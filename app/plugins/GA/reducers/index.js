import { combineReducers } from 'redux';
import { createPluginsReducer } from '../utils';
import initialState from '../../../store/initialState';

const crossover = createPluginsReducer('crossover', initialState.GA);
const mutation = createPluginsReducer('mutation', initialState.GA);
const options = createPluginsReducer('options', initialState.GA);
const fitness = createPluginsReducer('fitness', initialState.GA);
const evolution = createPluginsReducer('evolution', initialState.GA);

export default combineReducers({
	crossover,
	mutation,
	fitness,
	options,
	evolution
});
