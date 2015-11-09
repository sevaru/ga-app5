//Base paths
const APP = '../app/';
const PLUGIN = APP + 'plugins/GA/plugin/';

//Module paths
const NOTE = PLUGIN + 'utils/Note.js';
const NOTES_CONVERTER = PLUGIN + 'utils/NotesConverter.js';
const COMMON = PLUGIN + 'common.js';

jest.dontMock(NOTE);
jest.dontMock(COMMON);
jest.dontMock(NOTES_CONVERTER);

describe('NotesConverter', () => {
	const NotesConverter = require(NOTES_CONVERTER);
	const Note = require(NOTE);

	it('toNotes', () => {
		const raw = [
			3, -1, 3, -1, 3, -1, 3, -1,
			1, 2, 3, 4, 5, -1, -1, -1,
			0, -1, -1, -1, 1, 2, 3, 4
		];

		const expectedResult = [
			Note.create(3, 2), Note.create(3, 2), Note.create(3, 2), Note.create(3, 2),
			Note.create(1), Note.create(2), Note.create(3), Note.create(4), Note.create(5, 4),
			Note.create(0, 4), Note.create(1), Note.create(2), Note.create(3), Note.create(4)
		].map(n => n.toRaw()).toString();

		expect(NotesConverter.toNotes(raw).map(n => n.toRaw()).toString()).toBe(expectedResult);
	});

	it('fromBarsToRaw', () => {
		const bars = [
			[Note.create(3, 2), Note.create(3, 2), Note.create(3, 2), Note.create(3, 2)],
			[Note.create(1), Note.create(2), Note.create(3), Note.create(4), Note.create(5, 4)],
			[Note.create(0, 4), Note.create(1), Note.create(2), Note.create(3), Note.create(4)]
		];

		const expectedResult = [
			3, -1, 3, -1, 3, -1, 3, -1,
			1, 2, 3, 4, 5, -1, -1, -1,
			0, -1, -1, -1, 1, 2, 3, 4
		].toString();

		const result = NotesConverter.fromBarsToRaw(bars).toString();

		expect(result).toBe(expectedResult);
	});
});
