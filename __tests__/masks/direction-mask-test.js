import {PLUGIN} from '../consts'; 

const DIRECTION_MASK_PATH = `../${PLUGIN}/masks/directionMask.js`;
const COMPOSITION_PATH = `../${PLUGIN}/utils/Composition.js`;
jest.dontMock('lodash');
jest.dontMock(DIRECTION_MASK_PATH);
jest.dontMock(COMPOSITION_PATH);

const { directionForBar, DIRECTION } = require(DIRECTION_MASK_PATH);
const makeIt = 
	(title, sample, expectation, options) =>
		it(title, () => 
			expect(directionForBar(sample, options)).toEqual(expectation));

describe('Direction mask', () => {
	makeIt('should be up', [1, 2, 3, 4, 5], DIRECTION.UP, { spread: 1 });
	makeIt('should be down', [4, 3, 2, 1], DIRECTION.DOWN, { spread: 1 });
	makeIt('should be up for complex', [1, 0, 1, -1, 2, 3], DIRECTION.UP, { spread: 1 });
	makeIt('should be stable for complex', [1, 1, 1, 1, 2, 0], DIRECTION.STABLE, { spread: 1 });
	makeIt('should be none', [1, 5, 1, 3, 1], DIRECTION.NONE);
});