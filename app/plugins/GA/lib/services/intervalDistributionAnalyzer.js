import { chunk, last, initial } from 'lodash';
import { normalizeHolds } from '../utils/normalization';
import MusicContext, { PAUSE } from '../MusicContext';

// TODO: test this module it

function calculateDistributionForBar(bar) {
	const filteredBar = bar.filter(g => g !== PAUSE);
	const pairs = chunk(filteredBar, 2);
	const filteredPairs = last(pairs).length === 2 ? pairs : initial(pairs); // all but last
	const step = 1 / filteredPairs.length;

	return filteredPairs
		.reduce((reducer, [a, b]) => {
			const interval = MusicContext.getHalfTonesBeetween(a, b);
			const prevValue = reducer[interval] || 0;
			reducer[interval] = prevValue + step;
			return reducer;
		}, {});
}

export function intervalDistributionAnalyzer(rawData) {
	const barSize = MusicContext.getBarLength();
	const data = normalizeHolds(rawData);
	const bars = chunk(data, barSize);

	return bars.map(bar =>
			calculateDistributionForBar(bar));
}
