import routes from '../routes.jsx';
import nav from '../nav.js';

// TODO: reimplement singleton to context

/**
 * @description Used to register plugins in app.
 * Also provides a link in navigation sidebar
 */
class PluginRegister {
	/**
	 * @param {Object} options
	 * @param {string} options.path
	 * @param {React.Component} options.component
	 * @param {string} options.title 
	 * @param {Boolean} [options.useNav=true]
	 * @return {void}
	 */
	register({ path, component, title, useNav = true }) {
		useNav && nav.push({ path, title });
		routes.childRoutes.push({ path, component });
	}
}

export default new PluginRegister();