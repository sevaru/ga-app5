import { combineReducers } from 'redux';
import initialState from '../../../store/initialState';
import { createPluginsReducer } from '../utils';

const crossover = createPluginsReducer('crossover', initialState.GA);
const mutation = createPluginsReducer('mutation', initialState.GA);
const options = createPluginsReducer('options', initialState.GA);
const fitness = createPluginsReducer('fitness', initialState.GA);

export default combineReducers({
	crossover,
	mutation,
	fitness,
	options
});
