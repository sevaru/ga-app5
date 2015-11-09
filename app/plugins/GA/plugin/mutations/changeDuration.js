import { arrayUtils } from '../utils.js';
import Composition from '../utils/Composition.js';
import NotesConverter from '../utils/NotesConverter.js';
import Note from '../utils/Note.js';

const defaultOptions = {
	count: 64
};

const PAUSE = 0;
const HOLD = -1;


function __assertHelper( bars ) {
	let count = 0;

	bars.forEach(bar => {
		bar.forEach(note => {
			count += note.length();
		});
	});

	return count;
}

class ChangeDuration {
	mutate( data, options = {} ) {
		const debugStr = data.toString();
		options = Object.assign({}, defaultOptions, options);

		const __assert_data_count = data.length;
		
		const composition = new Composition(data);
		const bars = composition.bars();

		const newBars = bars.map(bar => {
			const countOfIndexes = Math.floor(options.count / bars.length);
			const maxIndex = (bar.length - 1) - 1; //we need neightbor

			if ( countOfIndexes >= maxIndex ) {
				return bar;
			}

			let indexes = arrayUtils.getRandomIndexes(countOfIndexes, maxIndex)

			indexes.forEach(i => {
				let [a, b] =  this._mutateOne(bar[i], bar[i + 1]);
				let newBar = bar.slice(0, i);

				if ( a ) {
					newBar.push(a);
				}

				if ( b ) {
					newBar.push(b);
				} 

				newBar = newBar.concat(bar.slice(i + 2));
				bar = newBar;
			});

			return bar;
		});

		const __assert_after_composition_count = __assertHelper(newBars);
		const __assert_composition_length = composition._notes.reduce((prev, note) => prev + note.length(), 0);
		console.assert(__assert_data_count === __assert_composition_length, `composition notes fail!! should ${__assert_data_count} but ${__assert_composition_length}`);
		console.assert(__assert_data_count === __assert_after_composition_count, 'count after composition and bars() fail');

		let result = NotesConverter.fromBarsToRaw(newBars);
		return result;
	}

	_mutateOne( a, b ) {
		let inverse = false;
		//Less
		if ( Math.random() < 0.5 ) {
			inverse = true;
			[a, b] = [b, a];
		}

		a = Note.create(a.value(), a.length() + 1);
		if ( b.length() === 1 ) {
			b = null;
		} else {
			b = Note.create(b.value(), b.length() - 1);
		}

		return inverse ? [b, a] : [a, b];
	}
}

export default new ChangeDuration();