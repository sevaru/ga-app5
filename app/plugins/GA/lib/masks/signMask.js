import { last } from 'lodash';
import { PAUSE, HOLD } from '../MusicContext';
import Composition from '../utils/Composition';

const filterBar = bar => bar.map(x => x === HOLD ? PAUSE : x);

/**
 * @internal Exported for tests 
 */
export function barAnalyzer([bar, prevBar = []]) {
	return filterBar(bar).reduce(({ prev, data }, note) => {
		if (prev == null) {
			return {
				data: [],
				prev: note
			};
		}

		const diff = note - prev;

		let value = 0;
		if (diff > 0) {
			value = 1
		} else if (diff < 0) {
			value = -1
		}

		return {
			data: [...data, value],
			prev: note
		};

	}, { data: [], prev: last(filterBar(prevBar)) }).data;
}

export const signMask =
	(data, options) =>
		Composition
			.create(data)
			.rawBars()
			.reduce((reducer, bar, index, array) =>
				[...reducer, barAnalyzer([bar, index ? array[index - 1] : undefined], options)], []);
