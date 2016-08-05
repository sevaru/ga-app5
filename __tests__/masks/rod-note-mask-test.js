import {PLUGIN} from '../consts'; 

const RODE_NOTE_MASK_PATH = `../${PLUGIN}/masks/rodNoteMask.js`;
const COMPOSITION_PATH = `../${PLUGIN}/utils/Composition.js`;
jest.dontMock('lodash');
jest.dontMock(RODE_NOTE_MASK_PATH);
jest.dontMock(COMPOSITION_PATH);

const { rodNoteForBar, ROD_TYPE } = require(RODE_NOTE_MASK_PATH);
const makeIt = 
	(title, sample, expectation, options) =>
		it(title, () => 
			expect(rodNoteForBar(sample, options)).toEqual(expectation));

describe('Rod note mask', () => {
	makeIt('should be up', [1, 2, 3, 4, 5, 6, 7, 8], [1, 5], { rodeType: ROD_TYPE.TWO });
});