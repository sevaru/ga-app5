const PAUSE = 0;
const HOLD = -1;

class NotesUtils {
	/*
		[1, -2, 3, 1, 1] where 1 is 1/8 and "-" is pause
	*/
	// TODO: redo fitness and this creepy logic
	toRhythm( data ) {
		let result = [];
		let bar = undefined;

		data.forEach((item, i) => {
			if ( i % 8 === 0 ) {
				if ( bar ) {
					result.push(bar);
				}
				bar = [];
			}

			if ( item === PAUSE ) {
				bar.push(-1);
				return;
			}

			if ( item === HOLD && bar.length ) {
				const prevIndex = bar.length - 1; 
				const prevValue = bar[prevIndex];
				bar[prevIndex] = prevValue > 0 ? prevValue + 1 : prevValue - 1;
				return;
			}

			bar.push(1);
		});
		result.push(bar);

		return result;
	}

	toPitch( data, ignoreOctaves = false ) {
		let result = [];
		let bar = undefined

		data.forEach((item, i) => {
			if ( i % 8 === 0 ) {
				if ( bar ) {
					result.push(bar);
				}
				bar = [];
			}
			if ( item === PAUSE || item === HOLD ) {
				return;
			}

			bar.push(ignoreOctaves ? item % 7 : item);
		});
		result.push(bar);

		return result;
	}
}

export default new NotesUtils();