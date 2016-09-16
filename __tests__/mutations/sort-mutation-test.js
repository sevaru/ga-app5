import {PLUGIN} from '../consts'; 

const SORT_PATH = `../${PLUGIN}/mutations/providers/sortMutation/calculate.js`;
const UTILS_PATH = `../${PLUGIN}/utils.js`;
jest.dontMock(SORT_PATH);
//jest.mock(UTILS_PATH);
jest.setMock(UTILS_PATH, {
	numberUtils: {
		randomBetween: () => {
			return 3;
		}
	}
});


describe('Sort mutation', () => {
	const sortMutation = require(SORT_PATH).calculate;
	const sampleData = [1, 9, 2, 5, 0, -1, 12, 4];

	it('should sort', () => {
		// Arrange
		const expectation = [1, 9, 2, /*start index*/ -1, 0, 5, 12, 4];

		// Act
		const result = sortMutation(sampleData, { count: 4 });
		
		// Assert
		expect(result).toEqual(expectation);
	});
});