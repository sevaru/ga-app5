import { notesUtils } from '../../utils.js';

const defaultOptions = {
	pitch: 1,
	rhythm: 1,
	maxPitchDistance: 4
};

class MelodyFitness {
	fitness( content, reference, options = {} ) {
		options = this._normalizeOptions(Object.assign({}, defaultOptions, options));

		let sum = 0;
		const contentPitch = notesUtils.toPitch(content);
		const referencePitch = notesUtils.toPitch(reference);
		const contentRhythm = notesUtils.toRhythm(content);
		const referenceRhythm = notesUtils.toRhythm(reference);
		const barsCount = referencePitch.length;

		referencePitch.forEach((bar, index) => {
			sum += this._calculatePitchSimilarityByBar(contentPitch[index], bar,  options.maxPitchDistance) * options.pitch;
		});

		referenceRhythm.forEach((bar, index) => {
			sum += this._calculateRhytmSimilarityByBar(contentRhythm[index], bar) * options.rhythm;
		});

		return sum / barsCount;
	}

	_calculatePitchSimilarityByBar( contentBar, referenceBar, maxPitchDistance) {
		let sum = 0;
		referenceBar.forEach((refNote, index) => {
			const note = contentBar[index];
			const diff = Math.abs(note - refNote);

			if ( diff > maxPitchDistance ) {
				return;
			}

			sum += (1 - diff/maxPitchDistance);
		});
		return sum / referenceBar.length;
	}

	_calculateRhytmSimilarityByBar( contentBar, referenceBar ) {
		let sum = 0;
		referenceBar.forEach((refBit, index) => {
			const bit = contentBar[index];
			if ( bit === refBit ) {
				sum += 1;
			}
		});
		return sum / referenceBar.length;
	}

	_normalizeOptions(options) {
		const max = options.pitch + options.rhythm;
		return Object.assign(options, {
			pitch: options.pitch / max, 
			rhythm: options.rhythm / max 
		});
	}

}

export default new MelodyFitness();