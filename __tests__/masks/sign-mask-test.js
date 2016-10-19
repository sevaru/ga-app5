import {PLUGIN} from '../consts'; 

const MASK_PATH = `../${PLUGIN}/masks/signMask.js`;
const COMPOSITION_PATH = `../${PLUGIN}/utils/Composition.js`;
jest.dontMock('lodash');
jest.dontMock(MASK_PATH);
jest.dontMock(COMPOSITION_PATH);

const { barAnalyzer } = require(MASK_PATH);
const makeIt = 
	(title, sample, expectation, options) =>
		it(title, () => 
			expect(barAnalyzer(sample, options)).toEqual(expectation));

describe('Sign mask', () => {
	makeIt(
        'should work', 
        [
            [1, 3, 3, 5, 6, 7, 8, 9] /* Current bar */
        ],
        [
            1, 0, 1, 1, 1, 1, 1
        ], { /* options */ });

    makeIt(
        'should work', 
        [
	        [10, 9, 8, 8, 6, 5, 4, 3], /* Current bar */
	        [1, 3, 3, 5, 6, 7, 8, 9] /* Prev bar */
        ],
        [
	        1, -1, -1, 0, -1, -1, -1, -1
        ], { /* options */ });
});