import NotesConverter from './NotesConverter.js';
import MusicContext from '../MusicContext';

export default class Composition {
	static create(raw, barLength) {
		return new Composition(raw, barLength);
	}

	constructor( raw, barLength = MusicContext.getBarLength() ) {
		if ( !Array.isArray(raw) ) {
			throw `Invalid argument raw: ${raw}, should be an array of numbers`;
		}

		this._barLength = barLength;
		this._raw = null;
		this._notes = null;
		this._bars = null;

		this._updateState(raw);
	}

	length() {
		return this._notes.length;
	}

	bars() {
		let result = [];
		let bar = [];
		let counter = 0;

		this._notes.forEach(note => {
			counter += note.length();
			bar.push(note.clone());
			
			console.assert(counter <= this._barLength, `Counter: ${counter} but should be less than ${this._barLength}`);
			if ( counter === this._barLength ) {
				counter = 0;
				result.push(bar);
				bar = [];
			}
		});

		return result;
	}

	rawBars() {
		return this
			.bars()
			.map(bar =>
				bar.reduce((reducer, note) =>
					[...reducer, ...note.toRaw()], []));
	}

	raw() {
		return this._raw.slice();
	}

	_updateState( raw ) {
		this._raw = raw.slice();
		this._notes = NotesConverter.toNotes(this._raw);
		this._bars = this.bars();
	}
}