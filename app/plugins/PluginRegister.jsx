import routes from '../routes.jsx';
import nav from '../nav.js';

class PluginRegister {
	register({ path, component, title, useNav }) {
		useNav = useNav == null ? true : useNav;

		if ( useNav ) {
			nav.push({
				path,
				title
			});
		}

		routes.childRoutes.push({
			path,
			component
		});
	}
}

export default new PluginRegister();