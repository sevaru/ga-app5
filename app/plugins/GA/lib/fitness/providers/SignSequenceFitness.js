import { signMask } from '../../masks/signMask';
import { fitnessExecutor, barContentEqualityComparer } from '../../utils/executors';

export default {
	name: 'sign-sequence-fitness',
	run: fitnessExecutor(signMask)(barContentEqualityComparer),
	getInitialState: () => ({ weight: 0, _important: false })
};
