import {PLUGIN} from '../consts';

const GROUP_PATH = `../${PLUGIN}/services/Groups.js`;
const LODASH = 'lodash';
jest.dontMock(LODASH);
jest.dontMock(GROUP_PATH);

describe('Groups', () => {
	const { Groups } = require(GROUP_PATH);
	const sampleData = [1, 9, 2, 5, 0, -1, 12, 4];

	const generateIt = 
		(title) =>
			(data, size, offset) =>
				(expectation) => {
					it(
						title,
						() =>
							expect(
								Groups.create(data, size, offset).get()
							)
							.toEqual(expectation)
					);
				}

	describe('Groups constructing', () => {
		generateIt('should generate chunks without offset')(sampleData, 3, 0)([[1, 9, 2], [5, 0, -1], [12, 4]]);
		generateIt('should generate chunks with offset')(sampleData, 3, 1)([[1], [9, 2, 5], [0, -1, 12], [4]]);
	});
});
