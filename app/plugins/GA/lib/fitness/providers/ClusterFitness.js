import { clusterMask } from '../../masks/clusterMask';
import { fitnessExecutor, barEqualityComparer } from '../../utils/executors';

export default {
	name: 'cluster-fitness',
	run: fitnessExecutor(clusterMask)(barEqualityComparer),
	getInitialState: () => ({ weight: 0.1, _important: false })
};
