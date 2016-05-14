import React from 'react';
import { SliderControl } from '../../../components/UIFactory.jsx';
import { arrayUtils } from '../../utils.js';
import Composition from '../../utils/Composition.js';
import NotesConverter from '../../utils/NotesConverter.js';
import Note from '../../utils/Note.js';

const defaultOptions = {
	count: 64
};

const PAUSE = 0;
const HOLD = -1;

// TODO: class vs functions combination
class ChangeDuration {
	mutate( data, options = {} ) {
		options = Object.assign({}, defaultOptions, options);

		const composition = new Composition(data);
		const bars = composition.bars();

		const newBars = bars.map(bar => {
			const countOfIndexes = Math.floor(options.count / bars.length);
			const maxIndex = (bar.length - 1) - 1; //we need neighbor


			if ( countOfIndexes >= maxIndex ) {
				return bar;
			}

			return arrayUtils
				.getRandomIndexes(countOfIndexes, maxIndex)
				.reduce((store, mutateIndex) => {
					// If random index exist before but now array (bar) became smaller so we don't have it
					if (!store[mutateIndex + 1]) {
						return store;
					}
					const mutateNotes = [store[mutateIndex].clone(), store[mutateIndex + 1].clone()];
					return [
						// Copy of bar from 0 -> mutateIndex
						...store.slice(0, mutateIndex).map(n => n.clone()),

						// 2 mutated notes
						...this._mutateOne(...mutateNotes),

						// Copy of bar from mutateIndex + 2 to the end
						...store.slice(mutateIndex + 2)
					];
				}, bar);
		});

		return NotesConverter.fromBarsToRaw(newBars);
	}

	/**
	 * @param  {Note} a [description]
	 * @param  {Note} b [description]
	 * @return {[Note, Note] | [Note]}
	 */
	_mutateOne( a, b ) {
		let inverse = false;

		if ( Math.random() < 0.5 ) {
			inverse = true;
			[a, b] = [b, a];
		}

		const newA = Note.create(a.value(), a.length() + 1);

		if (b.length() === 1) {
			return [newA];
		}

		const newB = Note.create(b.value(), b.length() - 1);
		return inverse ? [newB, newA] : [newA, newB];
	}
}

const instance = new ChangeDuration();

const run = instance.mutate.bind(instance);

const render = 
	(state, onblur) => (
		<SliderControl
        	defaultValue={state.count}
        	onBlur={onblur.bind(null, 'count')}
        	field={'count'} 
        	title="Count of genes"
			min={1}
			max={16}
			step={1}
    	/>
	);

const getInitialState = () => ({
	weight: 1,
	count: 7
});

export default {
	name: 'change-duration-mutation',
	run,
	render,
	getInitialState
};
