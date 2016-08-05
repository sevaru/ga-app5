import { clusterMask } from '../../masks/clusterMask';
import { fitnessExecutor, barEqualityComparer } from '../../utils/executors';
import { normalizeNotesDiscrete } from '../../utils/normalization';

export default {
	name: 'cluster-fitness',
	run: fitnessExecutor(clusterMask)(barEqualityComparer),
	getInitialState: () => ({ weight: 0.5, _important: false })
};
