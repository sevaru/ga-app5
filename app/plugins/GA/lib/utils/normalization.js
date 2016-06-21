import MusicContext from '../MusicContext';
import { numberUtils } from '../utils';

/**
 * Replace holds with pauses
 * @type {Array<Number>}
 */
export const normalizeHolds =
	content => 
		content
		.reduce((store, current) => 
			store.concat(current === -1 ? 0 : current), []);

/**
 * Replace holds with previous notePitchs/pauses
 * @example 7, -1, -1, 0, -1 = 7, 7, 7, 0, 0
 */
export const normalizeNotesDiscrete =
	content => 
		content
		.reduce((store, current) => {
			if (current >= 0) {
				store.note = current;
			}
			store.data.push(store.note);
			return store;
		}, { data: [], note: 0 })
		.data;


// TODO: probably could be dynamic, for now static
const MAX_ONE_OCTAVE_VALUE = MusicContext.getMaxOneOctaveValue();
export const normalizePitchToOctave =
	content => 
		content
		.map(v => numberUtils.normalizeValue(v, MAX_ONE_OCTAVE_VALUE));


export const normalizer =
	normalizers =>
		content =>
			normalizers
				.reduce((data, normalizerFn) =>
					normalizerFn(data), content);