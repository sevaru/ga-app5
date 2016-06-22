import { noteSizeDistributionAnalyzer } from '../../services/noteSizeDistributionAnalyzer';
import { calculateError } from './NoteSizePartialFitness/calculateError';

const run = (content, reference, options) => {
	console.assert(content.length === reference.length);

	const referenceAnalysis = noteSizeDistributionAnalyzer(reference);
	const contentAnalysis = noteSizeDistributionAnalyzer(content);
	return referenceAnalysis
		.reduce((reducer, bar, index) => {
			const contentBar = contentAnalysis[index];
			const error = calculateError(bar, contentBar);
			return reducer + (1 - error);
		}, 0) / referenceAnalysis.length;
};

const getInitialState = () => ({ 
	weight: 1,
	_important: false
});

export default {
	name: 'note-size-partial-fitness',
	run,
	getInitialState
};
