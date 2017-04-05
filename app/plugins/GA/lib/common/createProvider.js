import {createPluginsHash} from './createPluginsHash';
import {createRenderComponent} from './createRenderComponent';
import BaseCalculateProvider from './BaseCalculateProvider';
import CompositeCalculateProvider from './CompositeCalculateProvider';
import rootState from '../../../../store/initialState';

const initialState = rootState.GA;

export function createCompositeProvider(providerName, context) {
	const plugins = createPluginsHash(context);
	const instance = new CompositeCalculateProvider(plugins, initialState, providerName);
	
	// NOTE: run is actually getCalculation function
	const run = ::instance.getRunOnce;
	return {
		run,
		Component: createRenderComponent(providerName, plugins)
	};	
}

/**
 * @param {string} providerName
 * @param {Array<Object>} context
 * @param {boolean} randomRun
 * @returns {{ run: Function, Component: Function }}
 */
export default (providerName, context, randomRun = false) => {
	const plugins = createPluginsHash(context);
	const instance = new BaseCalculateProvider(plugins, initialState, providerName);
	
	// NOTE: run is actually getCalculation function
	const run = randomRun ? ::instance.getRunRandom: ::instance.getRunOnce;
	return {
		run,
		Component: createRenderComponent(providerName, plugins)
	};
};

