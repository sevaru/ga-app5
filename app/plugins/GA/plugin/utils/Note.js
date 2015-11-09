//#technical_debt value in range [-1 .. 14]
import { availableValues } from '../common.js';

const PAUSE = 0;
const NOTES_IN_OCTAVE = 7;

export default class Note {
	constructor( value, length = 1, legato = false ) {
		if ( value < 0 || availableValues.indexOf(value) === -1 ) {
			throw `Invalid argument value: ${value}`;
		}

		if ( !Number.isInteger(length) || length <= 0 ) {
			throw `Invalid argument length: ${length}`;
		}

		this._value = value;
		this._length = length;
		this._legato = legato;
	}

	clone() {
		return new Note(this._value, this._length);
	}

	static create( value, length, legato ) {
		return new Note(value, length, legato);
	}

	pitch( ignoreOctave = false ) {
		if ( !this.isNote() ) {
			throw 'Note is note pitch is a pause';
		}

		return ignoreOctave ? this._value % NOTES_IN_OCTAVE: this._value;
	}

	value() {
		return this._value;
	}

	length() {
		return this._length;
	}

	isNote() {
		return this._value > PAUSE;
	}

	isPause() {
		return this._value === PAUSE;
	}

	toRaw() {
		let result = [this._value];

		if ( this._length > 1 ) {
			let count = this._length - 1;
			while ( count > 0 ) {
				count--;
				result.push(-1);
			}
		}

		return result;
	}

	//Immutable
	increaseLength( howMuch = 1 ) /*: Note */ {
		return this._changeLength(howMuch);
	}

	decreaseLength( howMuch = 1 ) /*: Note */ {
		if ( this._length === 1 ) {
			throw 'Length can not be less than 1';
		}
		return this._changeLength(-howMuch);
	}

	_changeLength( howMuch ) /*: Note */ {
		return new Note(this._value, this._length + howMuch);
	}
}