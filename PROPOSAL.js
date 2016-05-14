TODO
0) Get all reducers from app and from plugins
1) Create Root Store at app level with all reducers
2) recreate options via redux
3) add react-redux for container components (connect etc)




interface IRenderProvider {
	// 1) should have actions to call { CHANGE_OPTIONS_VALUE, value, prop } //prop = 'path.to.deep.prop'?
	/*
	// actions.js
	const CHANGE_OPTIONS_VALUE = Symbol('CHANGE_OPTIONS_VALUE');

	// fieldPath or separate reducers?
	const changeOptionsValue(value, fieldPath) {
		return {
			type: CHANGE_OPTIONS_VALUE,
			data: {
				path: 'crossover.crossoverName.paramName',
				value
			} 
		}
	}


	// reducers.js

	interface IData {
		name = 'crossoverName'
		optionName = 'name'
		value: any = value
	}

	function changeCrossOverOptionsReducer(state = INITIAL_CROSSOVER_OPTIONS, action) {
	 	switch (action.type) {
			case CHANGE_CROSSOVER_OPTION_VALUE:
				action.data.name

				return Object.assign(
					{},
					{
						[action.data.name]: {
							[action.data.optionName]: action.data.value
						}
					}
				);

				return state;
			default:
				return state;
		}

	}


	const rootReducer = combineReducers({
		changeCrossOverOptionsReducer,
		changeMutationOptionsReducer,
		changeFitnessOptionsReducer,
	})


	// GAOptions.jsx

	renderProvider(dispatch) {
		return (
			<input value={} onChange={(value) => {
				dispatch(changeOptionsAction('crossover', 'crossoverName', 'fieldName', value))
			}} />
		);
	}


	// WHERE TO HAVE STORE ?

	// 1. Store need rootReducer

	import React from 'react'
	import { render } from 'react-dom'
	import { Provider } from 'react-redux'
	import { createStore } from 'redux'
	import rootReducer from './reducers'
	import App from './components/App'

	let store = createStore(rootReducer)

	render(
	  <Provider store={store}>
	    <App />
	  </Provider>,
	  document.getElementById('root')

	 */
}

interface IDefaultsProvider {
	// ? to pass to store?
	/*
		
	 */
}

interface ICalculateProvider {

}


interface IProvider {
	render: IRenderProvider; 
	defaults: IDefaultsProvider; // included in renderer ?
	calculate: ICalculateProvider;
}

interface IProvidersContext {
	crossovers: IProvider[];
	mutations: IProvider[];
	fitness: IProvider[];
}




// GAOptions.tsx
import { ProvidersContext } from 'providers-context';

export default class GAOptions extends React.Component {
	constructor(params) {
		super(params);

		this.renderer = (props) => {
			return ProvidersContext.crossovers.map((provider: IProvider) => provider.render(props));
		}
	}

    render() {
    	return (
			<h1> Some Header </h1>
			{this.renderer(this.props)}
			<p> _some footer_ </p>
		);
    }
}

// GA.js runnes in worker, so doesn't has context (ProviderContext) and all options should be passed directly

class GA {
	constructor() {
		// --CURRENT--
		// configure providers and they as singletons would be used in Individual
		
		// --BETTER--
		// 1) Create individuals factory and pass providers here
		// 2) Create individuals via factory (under the hood pass providers to individuals)			
	}
}