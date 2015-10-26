import Soundfont from 'soundfont-player';
import instrumentNames from './instrumentNames.jx';

//play(noteName, time, duration [, options])

class SoundfontPlayer {
	constructor(instrumentName = instrumentNames.xylophone) {
		this._ready = false;
		const ctx = new AudioContext();
		const soundfont = new Soundfont(ctx);
		this._instrument = soundfont.instrument(instrumentName);

		this._instrument.onready(() => this._ready = true);
	}

	changeInstrument(instrumentName) {
		this.ready = false;
		this._instrument = soundfont.instrument(instrumentName);
		this._instrument.onready(() => this._ready = true);
	}

	play(notes /*: string like c4, c5*/) {
		this._instrument.play(notes)
	}
}

export new SoundfontPlayer();