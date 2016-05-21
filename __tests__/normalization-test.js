import {PLUGIN} from './consts'; 

const NORMALIZATION = `${PLUGIN}/utils/normalization.js`;
jest.dontMock(NORMALIZATION);

describe('Normalization', () => {
	const {normalizeHolds, normalizeNotesDiscrete} = require(NORMALIZATION);
	const sampleData = [3, -1, -1, -1, 2, -1, 3, 4, 0, 5, 0, 5, 0, -1];

	it('should normalize holds', () => {
		// Arrange
		const expectation = [3, 0, 0, 0, 2, 0, 3, 4, 0, 5, 0, 5, 0, 0];

		// Act
		const result = normalizeHolds(sampleData);
		
		// Assert
		expect(result).toEqual(expectation);
	});

	it('should normalize notes descrite holds', () => {
		// Arrange
		const expectation = [3, 3, 3, 3, 2, 2, 3, 4, 0, 5, 0, 5, 0, 0];

		// Act
		const result = normalizeNotesDiscrete(sampleData);
		
		// Assert
		expect(result).toEqual(expectation);
	});
});