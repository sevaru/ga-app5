import routes from '../routes.jsx';
import nav from '../nav.js';

class PluginRegister {
	register({ path, component, title }) {
		console.log(title);

		nav.push({
			path,
			title
		});

		routes.childRoutes.push({
			path,
			component
		});

		console.log(routes.childRoutes);
	}
}

export default new PluginRegister();