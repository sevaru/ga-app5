import {createPluginsHash} from './createPluginsHash';
import {createRenderComponent} from './createRenderComponent';
import BaseCalculateProvider from './BaseCalculateProvider';
import rootState from '../../../../store/initialState';

const initialState = rootState.GA;

export default (providerName, context, randomRun = false) => {
	const plugins = createPluginsHash(context);
	const instance = new BaseCalculateProvider(plugins, initialState, providerName);
	const run = randomRun ? instance.getRunRandom.bind(instance): instance.getRunOnce.bind(instance); 
	return {
		run,
		Component: createRenderComponent(providerName, plugins)
	};
};
