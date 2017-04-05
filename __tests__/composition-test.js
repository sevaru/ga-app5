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
	const Note = require(NOTE).default;

	const raw = [
		3, -1, 3, -1, 3, -1, 3, -1,
		1, 2, 3, 4, 5, -1, -1, -1,
		0, -1, -1, -1, 1, 2, 3, 4
	];

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
