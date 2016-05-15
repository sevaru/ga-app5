//Base paths
const APP = '../app/';
const PLUGIN = APP + 'plugins/GA/lib/';

//Module paths
const NOTE = PLUGIN + 'utils/Note.js';
const COMMON = PLUGIN + 'common.js';

jest.dontMock(NOTE);
jest.dontMock(COMMON);

describe('Note', () => {
	const Note = require(NOTE).default;

	it('Should throw exception on invalid arguments', () => {
		const invalidArgument = -1;
		expect(() => new Note(invalidArgument)).toThrow(`Invalid argument value: ${invalidArgument}`);
	});

	it('Should throw exception on invalid arguments', () => {
		const invalidArgument = 15;
		expect(() => new Note(invalidArgument)).toThrow(`Invalid argument value: ${invalidArgument}`);
	});

	it('Should throw exception on invalid arguments', () => {
		const value = 3;
		const length = 'a';
		expect(() => new Note(value, length)).toThrow(`Invalid argument length: ${length}`);
	});

	it('Should throw exception on invalid arguments', () => {
		const value = 3;
		const length = 0;
		expect(() => new Note(value, length)).toThrow(`Invalid argument length: ${length}`);
	});

	it('Should get pitch', () => {
		const note = new Note(8, 2);
		expect(note.pitch()).toBe(8);
	});

	it('Should get pitch with ignore octave', () => {
		const note = new Note(8, 2);
		expect(note.pitch(true)).toBe(1);
	});

	it('Should get length', () => {
		const note = new Note(8, 2);
		expect(note.length()).toBe(2);
	});

	it('Should isNote to be true on notes', () => {
		const note = new Note(8, 2);
		expect(note.isNote()).toBe(true);
	});

	it('Should IsNote to be false on pauses', () => {
		const note = new Note(0, 2);
		expect(note.isNote()).toBe(false);
	});

	it('Should isPause to be true on pause', () => {
		const note = new Note(0, 2);
		expect(note.isPause()).toBe(true);
	});

	it('Should isPause to be false on notes', () => {
		const note = new Note(4, 2);
		expect(note.isPause()).toBe(false);
	});

	it('Should toRaw', () => {
		const note = new Note(4, 4);
		expect(note.toRaw().toString()).toBe([4, -1, -1, -1].toString());
	});
});
