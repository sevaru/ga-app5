import { chunk } from 'lodash';
import { normalizePitchToOctave } from '../utils/normalization';
import MusicContext from '../MusicContext';

// TODO: test this module it

function calculateDistributionForBar(bar, availableValues) {
	const barSize = bar.length;

	const obj = {};
	// 1. Prepopulate with initial values
	availableValues.forEach(v => {
		obj[v] = 0;
	});

	// 2. Summ
	bar.forEach(g => {
		obj[g]++;
	});

	// 3. Normalize
	availableValues.forEach(v => {
		obj[v] = obj[v] / barSize;
	});

	return obj;
}

export function pitchDistributionAnalyzer(data, ignoreOctaves = false) {
	const normalizedData = ignoreOctaves ? normalizePitchToOctave(data) : data;
	const availableValues = MusicContext.getAvailablePitchValues(ignoreOctaves);
	const barSize = MusicContext.getBarLength();
	const bars = chunk(normalizedData, barSize);

	return bars
		.map(bar =>
			calculateDistributionForBar(bar, availableValues));
}