const STEP = 1/8;
const WHOLE_LENGTH = 128; //in STEP
const BAR = WHOLE_LENGTH * STEP; // in STEPS

const BIT_VALUES = [4, 2, 3, 1];
const MAX_DISTANCE = 4;
//each bar has 10 balls to normalize we need to /16 and it's 1 ball for bar and /8 (8 bars)

const PAUSE = -1;
const HOLD = 0;

class MagnitudeFitness {
	fitness( content, reference ) {
		let sum = 0;
		for ( let i = 0, l = content.length; i < l; i++ ) {
			const index = i % 16; // from 0 - 15;
			const bitValue = this._getBitValue(index);
			const refValue = reference[i];
			const contentValue = content[i];


			if ( 
				(refValue === PAUSE || contentValue === PAUSE) ||
				(refValue === HOLD || contentValue === HOLD)
			) {
				if ( refValue === contentValue ) {
					sum += bitValue;
				}
				continue;
			}

			const distance = Math.abs(content[i] - reference[i]);

			if ( distance > MAX_DISTANCE ) {
				continue;
			}

			sum += bitValue * (1 - distance / MAX_DISTANCE);
		}

		return this._normalize(sum);
	}

	_getBitValue( index ) {
		for ( let i = 0; i < 4; i++ ) {
			const start = i * 4;
			if ( (index >= start) && (index < start + 4) ) {
				return BIT_VALUES[i];				
			}
		}
		throw new 'Something went wrong in MagnitudeFitness._gitBitValue';
	}

	_normalize(value) {
		return value / 8 / 10 / 4;
	}
}

export default new MagnitudeFitness();