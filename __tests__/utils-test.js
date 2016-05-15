//Base paths
const APP = '../app/';
const PLUGIN = APP + 'plugins/GA/lib/';

//Module paths
const UTILS = PLUGIN + 'utils.js'
const NOTES_UTILS = PLUGIN + 'utils/NotesUtils.js'

jest.dontMock(UTILS);
jest.dontMock(NOTES_UTILS);

describe('stringUtils', () => {
	const stringUtils = require(UTILS).stringUtils;

	it('firstUpper should uppercase first char in string', () => {
		expect(stringUtils.firstUpper('hekko')).toBe('Hekko');
	});

	it('camelCaseToHuman should humanize string', () => {
		expect(stringUtils.camelCaseToHuman('helloWorldMyFriend')).toBe('Hello World My Friend');
	});
});


describe('arrayUtils', () => {
	const arrayUtils = require(UTILS).arrayUtils;

	it('findObjectByKey', () => {
		const arr = [{ id: 2, name: 'nope(' }, { id: 3, name: 'nope' }, { id: 1, name: 'It' }];
		const field = 'id';
		const value = 1;
		expect(arrayUtils.findObjectByKey(arr, field, value).name).toBe('It');
	});
});

describe('notesUtils', () => {
	const notesUtils = require(NOTES_UTILS).default;

	const content = [
		3, -1, 3, -1, 3, -1, 3, -1,
		8, 9, 10, 0, -1, -1, 2, 3
	];

	it('toRhythm', () => {
		const expectedRhytm = [[2, 2, 2, 2], [1, 1, 1, -3, 1, 1]].toString();
		expect(notesUtils.toRhythm(content).toString()).toBe(expectedRhytm);
	});

	it('toPitch no ignore octaves', () => {
		const expectedPitches = [[3, 3, 3, 3], [8, 9, 10, 2, 3]].toString();
		expect(notesUtils.toPitch(content).toString()).toBe(expectedPitches);
	});

	it('toPitch ignore octaves', () => {
		const expectedPitches = [[3, 3, 3, 3], [1, 2, 3, 2, 3]].toString();
		expect(notesUtils.toPitch(content, true).toString()).toBe(expectedPitches);
	});
});
