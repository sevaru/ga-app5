import Note from './Note.js';

class NotesConverter {
	constructor() {
		this._PAUSE = 0;
		this._HOLD = -1;
	}	

	toNotes( raw ) {
		let result = [];
		let previousNoteValue = 0;

		for ( let i = 0, l = raw.length; i < l; i++ ) {
			const item = raw[i];

			// If first item is hold
			if ( i === 0 && item === this._HOLD ) {
				//console.warn('First note is hold! Something wrong, replace it with pause');
				result.push(Note.create(0, 1, false));
				continue;
			}

			// If Hold on first note of bars
			if ( item === this._HOLD && i % 8 === 0 ) {
				result.push(Note.create(previousNoteValue, 1, true));				
				continue;
			}

			if ( item === this._HOLD ) {
				let last = result.pop();
				result.push(Note.create(last.value(), last.length() + 1, false));
				continue;
			}

			previousNoteValue = item;
			result.push(Note.create(item, 1, false));
		}

		return result;
	}

	fromBarsToRaw( bars ) {
		let result = [];

		bars.forEach(bar => {
			bar.forEach(n => {
				result = result.concat(n.toRaw());
			});
		});

		return result;
	}

}

export default new NotesConverter();