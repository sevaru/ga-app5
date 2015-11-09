import PluginRegister from '../PluginRegister.jsx';
import Index from './components/Index.jsx';
import Compositions from './components/Compositions.jsx';
import Composition from './components/Composition.jsx';

PluginRegister.register({
	path: '/ga_by_reference',
	component: Index,
	title: 'Genetic Algorithms (reference)'
});

PluginRegister.register({
	path: '/compositions',
	component: Compositions,
	title: 'Manage compositions'
});

PluginRegister.register({
	path: '/compositions/:composition',
	component: Composition,
	title: 'Manage compositions',
	useNav: false
});