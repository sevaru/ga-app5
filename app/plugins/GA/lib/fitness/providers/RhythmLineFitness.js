import { rhythmLineMask } from '../../masks/rhythmLineMask';
import { fitnessExecutor, barContentEqualityComparer } from '../../utils/executors';

export default {
	name: 'rhythm-line-fitness',
	run: fitnessExecutor(rhythmLineMask)(barContentEqualityComparer),
	getInitialState: () => ({ weight: 0.2, _important: false })
};
