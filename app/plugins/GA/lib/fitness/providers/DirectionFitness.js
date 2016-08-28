import { directionAnalyzer } from '../../masks/directionMask';
import { fitnessExecutor, barEqualityComparer } from '../../utils/executors';

export default {
	name: 'direction-fitness',
	run: fitnessExecutor(directionAnalyzer)(barEqualityComparer),
	getInitialState: () => ({ weight: 0.01 })
};
