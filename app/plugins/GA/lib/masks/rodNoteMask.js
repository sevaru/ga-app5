import { HOLD } from '../MusicContext';
import { maskFactory } from './helpers';

export const ROD_TYPE = {
	FIRST: 'FIRST',
	TWO: 'TWO',
	FOUR: 'FOUR',
	FIRST_AND_LAST: 'FIRST_AND_LAST'
};

const ROD_MASK = {
	[ROD_TYPE.FIRST]: [0],  		  // [1, 0, 0, 0, 0, 0, 0, 0]
	[ROD_TYPE.TWO]: [0, 4], 		  // [1, 0, 0, 0, 1, 0, 0, 0]
	[ROD_TYPE.FOUR]: [0, 2, 4, 6],    // [1, 0, 1, 0, 1, 0, 1, 0]
	[ROD_TYPE.FIRST_AND_LAST]: [0, 6] // [1, 0, 0, 0, 0, 0, 1, 0]
};

/**
 * @description exported for tests
 */
export const rodNoteForBar = 
	(bar, { rodeType = ROD_TYPE.FIRST } = {}) =>
		ROD_MASK[rodeType]
			.reduce((reducer, index) =>
				[...reducer, bar[index] === HOLD ? null : bar[index]], []);
/**
 * @description holds in rod notes became nulls
 * @type {Array<number>}
 */
export const rodNoteAnalyzer = maskFactory(maskFactory);