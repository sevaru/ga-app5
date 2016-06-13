import {PLUGIN} from '../consts';

const SORT_PATH = `../${PLUGIN}/mutations/providers/swapGroupMutation/calculate.js`;
const UTILS_PATH = `../${PLUGIN}/utils.js`;

const numberUtilsMock = {
	__fn: x => x + 1,
	_mock_set(fn) {
		this._fn = fn;
	},
	randomBetween(start, end) {
		return this.__fn(start, end);
	}
};

jest.dontMock(SORT_PATH);
jest.mock(UTILS_PATH, () => ({ numberUtils: numberUtilsMock }));

describe('Swap group mutation', () => {
	const swapGroupMutation = require(SORT_PATH).calculate;
	const sampleData = [1, 9, 2, 5, 0, -1, 12, 4];

	it('should swap', () => {
		// Arrange
		// [1, /*(*/ 9, 2, 5, /*)*/ 0, /*(*/ -1, 12, 4 /*)*/];
		const expectation = [1, /*(*/ -1, 12, 4, /*)*/ 0, /*(*/ 9, 2, 5 /*)*/];
		numberUtilsMock._mock_set(x => x + 1);

		// Act
		const result = swapGroupMutation(sampleData, { count: 3 });

		// Assert
		expect(result).toEqual(expectation);
	});

	// TODO: fix test
	/*
	xit('should swap 2', () => {
		// Arrange
		//  [1, 9, 2, 5, (0, -1, 12), 4];
		const expectation = [1, -1, 12, 4, 0, 9, 2, 5]; //[1, -1, 12, 4, 0, 9, 2, 5];

		const mockerFn = () => {
			const values = [0, 0]; //[1, 4];

			return () => {
				return values.pop();
			}
		};
		numberUtilsMock._mock_set(mockerFn());

		// Act
		const result = swapGroupMutation(sampleData, { count: 3 });

		// Assert
		expect(JSON.stringify(result)).toBe(JSON.stringify(expectation));
	});
	*/
});
