import Soundfont from 'soundfont-player';
import instrumentNames from './instrumentNames.js';
import { REFERENCE_TABLE } from '../common.js';

function isHold(val) {
	return val === -1
}

function isPause(val) {
	return val === 0
}

function isNote(val) {
	return val > 1 && val < 15;
}

const NOTE_LENGTH = 0.2; // 1/8 is 300ms const for now TODO: move to options

class Converter {
	//notes is Array<number> where number -1, .. , 15
	static convert(notes) {
		let result = [];

		notes.forEach(noteCode => {
			if ( isHold(noteCode) && result.length ) {
				result[result.length - 1].duration += NOTE_LENGTH;
				return
			}

			if ( isPause(noteCode) ) {
				result.push({
					note: null,
					duration: NOTE_LENGTH
				});
				return;
			}

			result.push({
				note: REFERENCE_TABLE[noteCode],
				duration: NOTE_LENGTH
			});
		});

		return result;
	}
}

//this._instrument.play(note, time, duration);
class Player {
	constructor(instrumentName = instrumentNames.acoustic_grand_piano) {
		this._ctx = new AudioContext();
		this._ready = false;
		this._notes = [];
		this._prevNotes = [];
		this._soundfont = new Soundfont(this._ctx);
		this._instrument = this._soundfont.instrument(instrumentName);
		this._timeout = null;
	
		this._isPlaying = false;
		this._instrument.onready(() => this._ready = true);
	}

	set(notes) {
		this._notes = Converter.convert(notes);
		this._prevNotes = this._notes.slice();
	}

	//notes is Array<number> where number -1, .. , 15
	play(notes) {
		if ( notes ) {
			this.set(notes);
		}

		if ( this._ready ) {
			this._playInternal();
		} else {
			this._instrument.onready(() => this._playInternal());
		}
	}

	_playInternal() {
		this._isPlaying = true;
		this._playTick();
	}

	_playTick() {
		const noteItem = this._notes.shift();

		if ( !noteItem || !this._isPlaying ) {
			this._clear();
			return;			
		}

		let { note, duration } = noteItem;
		this._instrument.play(note, this._ctx.currentTime);
		this._timeout = setTimeout(() => this._playTick(), duration * 1000); // timeout use mileseconds while we put second into noteItem
	}

	_clear() {
		clearTimeout(this._timeout);
		this._timeout = null;
	}

	stop() {
		this._isPlaying = false;
	}
}

export default new Player();
