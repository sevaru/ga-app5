import { melodyLineMask } from '../../masks/melodyLineMask';
import { fitnessExecutor, barContentEqualityComparer } from '../../utils/executors';
import { normalizeNotesDiscrete } from '../../utils/normalization';

export default {
	name: 'melody-line-fitness',
	run: fitnessExecutor(melodyLineMask)(barContentEqualityComparer),
	getInitialState: () => ({ weight: 0.5, _important: true })
};
