import Composition from '../utils/Composition';

function calculateDistributionForBar(bar) {
	const step = 1 / bar.length;
	return bar.reduce((reducer, note) => {
		const size = note.length();
		reducer[size] = (reducer[size] || 0) + step; 
		return reducer;
	}, {});
}

export const noteSizeDistributionAnalyzer = 
	(data, ignorePauses = false) => 
		Composition
			.create(data)
			.bars()
			.map(bar =>
				calculateDistributionForBar(bar, ignorePauses));