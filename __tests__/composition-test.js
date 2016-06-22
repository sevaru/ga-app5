//Base paths
const APP = '../app/';
const PLUGIN = APP + 'plugins/GA/lib/';

//Module paths
const COMPOSITION = PLUGIN + 'utils/Composition.js';
const NOTE = PLUGIN + 'utils/Note.js';
const NOTES_CONVERTER = PLUGIN + 'utils/NotesConverter.js';
const COMMON = PLUGIN + 'common.js';
const UTILS = PLUGIN + 'utils.js';
const MUSIC_CONTEXT = `${PLUGIN}/MusicContext.js`

jest.dontMock(COMPOSITION);
jest.dontMock(MUSIC_CONTEXT);
jest.dontMock(UTILS);
jest.dontMock(NOTE);
jest.dontMock(COMMON);
jest.dontMock(NOTES_CONVERTER);

describe('Composition', () => {
	function serialize( bar ) {
		return bar.map(b => b.map(n => n.toRaw()).toString()).toString();
	}

	const Composition = require(COMPOSITION).default;
	const NotesConverter = require(NOTES_CONVERTER).default;
	const Note = require(NOTE).default;

	const raw = [
		3, -1, 3, -1, 3, -1, 3, -1,
		1, 2, 3, 4, 5, -1, -1, -1,
		0, -1, -1, -1, 1, 2, 3, 4
	];

	const raw2 = [
		3, 1, 13, 2, 7, 4, 11, 4, 0, 1, 2, 9, 4, 2, 2, 12, 0, 12, 11, 12, 5, 9, 10, 1, 12, 11, 13, 5, 8, 12, 10, 13, 9, 1, 5, -1, 12, 9, 3, 2, -1, 11, 14, 5, 8, 3, 7, 2, 3, 6, 13, 5, 14, -1, 13, 9, 2, 9, 14, 7, 9, 13, 6, 7, 3, 6, 0, 6, 14, 7, -1, 4, 12, 6, -1, -1, 10, 10, 14, 3, -1, 11, -1, 13, 11, 7, 2, 4, 2, 2, 0, 8, 4, 6, 12, 8, 3, 1, 12, 13, 8, 9, 7, 10, 13, 6, 12, 6, 7, 9, 4, -1, 10, 12, 6, 12, 6, 10, 2, 12, 11, 3, 1, 2, -1, -1, 13, 12
	]

	const bars = [
		[Note.create(3, 2), Note.create(3, 2), Note.create(3, 2), Note.create(3, 2)],
		[Note.create(1), Note.create(2), Note.create(3), Note.create(4), Note.create(5, 4)],
		[Note.create(0, 4), Note.create(1), Note.create(2), Note.create(3), Note.create(4)]
	];

	it('bars method', () => {
		const composition = new Composition(raw);
		const testResult = composition.bars(); 
		expect(serialize(testResult)).toBe(serialize(bars));
	});
});
