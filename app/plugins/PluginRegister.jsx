import routes from '../routes.jsx';
import nav from '../nav.js';

class PluginRegister {
	register({ path, component, title }) {
		nav.push({
			path,
			title
		});

		routes.childRoutes.push({
			path,
			component
		});
	}
}

export default new PluginRegister();