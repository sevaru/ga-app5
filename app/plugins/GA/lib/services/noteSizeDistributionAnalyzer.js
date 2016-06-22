import Composition from '../utils/Composition';

function calculateDistributionForBar(bar) {
	const step = 1 / bar.length;
	const result = bar.reduce((reducer, note) => {
		const size = note.length();
		reducer[size] = (reducer[size] || 0) + step; 
		return reducer;
	}, {});

	return result;
}

export const noteSizeDistributionAnalyzer = 
	(data, ignorePauses = false) => 
		Composition
			.create(data)
			.bars()
			.map(bar =>
				calculateDistributionForBar(bar, ignorePauses));