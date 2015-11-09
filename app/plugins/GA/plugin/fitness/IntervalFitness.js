import { getValueBetweenNotes, MAX_AVERAGE_DIFF, MAX_DISPERSION_DIFF } from './IntervalFitness/common.js';
import { notesUtils } from '../utils.js';

const defaultOptions = {
	intervalValuesWeight: 0.5,
	intervalDispersionWeight: 0.5
};

class IntervalFitness {
	constructor() {
		this._referenceValues /*: Array<{dispersion: number, average: number}> - array of bars and their interval values */ = null;
	}

	reset() {
		this._referenceValues = null;
	}

	//TODO: options could be passed once
	fitness( content, reference, options = {} ) {
		options = this._normalizeOptions(Object.assign({}, defaultOptions, options));
		const contentPitch = notesUtils.toPitch(content);
		const referencePitch = notesUtils.toPitch(reference);

		const contentValues = this._calculateIntervalValues(contentPitch);
		if ( !this._referenceValues ) {
			this._referenceValues = this._calculateIntervalValues(referencePitch);
		}

		return this._calculateFitness(contentValues, options);
	}

	_calculateFitness( contentValues, options ) {
		const contentMaxIndex = contentValues.length;
		let averageSum = 0;
		let dispersionSum = 0;

		this._referenceValues.some(({ average: aRef, dispersion: dRef }, i) => {
			if ( contentMaxIndex <= i ) {
				return true;
			}
			let { average, dispersion } = contentValues[i];

			averageSum += Math.abs(aRef - average);
			dispersionSum += Math.abs(dRef - dispersion);
			return false;
		});

		averageSum = averageSum / this._referenceValues.length;
		dispersionSum = dispersionSum / this._referenceValues.length;

		averageSum = (1 - averageSum / MAX_AVERAGE_DIFF) * options.intervalValuesWeight;
		dispersionSum = (1 - dispersionSum / MAX_DISPERSION_DIFF) * options.intervalDispersionWeight;

		return averageSum + dispersionSum;
	}

	_calculateIntervalValues( bars ) {
		return bars.map(bar => this._calculateIntervalValuesForBar(bar));
	}

	_calculateIntervalValuesForBar( pitchesBar ) {
		let valuesArray = [];
		const count = pitchesBar.length;
		let sum = 0;

		for ( let i = 0; i < count - 1; i++ ) {
			const a = pitchesBar[i];
			const b = pitchesBar[i + 1];

			const value = getValueBetweenNotes(a, b);
			sum += value;
			valuesArray.push(value);
		}

		const average = sum / count;
		const dispersion = valuesArray
								.map(v => Math.pow((v - average), 2))
								.reduce((prev, val) => prev + val, 0);

		return { average, dispersion };
	}

	_normalizeOptions( options ) {
		const max = options.intervalValuesWeight + options.intervalDispersionWeight;
		return Object.assign(options, {
			intervalValuesWeight: options.intervalValuesWeight / max, 
			intervalDispersionWeight: options.intervalDispersionWeight / max 
		});
	}

}

export default new IntervalFitness();