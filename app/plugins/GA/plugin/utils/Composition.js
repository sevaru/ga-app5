import Note from './Note.js';
import NotesConverter from './NotesConverter.js';
import { arrayUtils } from '../utils.js';

const DEFAULT_BAR_LENGTH = 8;

export default class Composition {
	constructor( raw, barLength = DEFAULT_BAR_LENGTH ) {
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
			
			console.assert(counter <= 8, `Counter: ${counter} but should be less than 8`);
			if ( counter === 8 ) {
				counter = 0;
				result.push(bar);
				bar = [];
			}
		});

		return result;
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