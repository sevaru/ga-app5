import {normalizeNotesDiscrete} from '../../utils/normalization';

const run =
	(content, reference) => {
		const normContent = normalizeNotesDiscrete(content);
		const normReference = normalizeNotesDiscrete(reference);
		const point = 1 / normContent.length;

		return normContent
			.reduce((store, item, index) =>
				 item === normReference[index] ? store + point : store, 0);
	};

const getInitialState = () => ({ weight: 1 });

export default {
	name: 'basic-reference-fitness',
	run,
	getInitialState
};
