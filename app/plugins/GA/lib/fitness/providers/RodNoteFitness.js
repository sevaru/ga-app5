import { rodNoteAnalyzer } from '../../masks/rodNoteMask';
import { fitnessExecutor } from '../../utils/executors';

export default {
	name: 'rod-note-fitness',
	run: fitnessExecutor(rodNoteAnalyzer)((referenceByBar, contentByBar) => {
		const step = 1 / referenceByBar.length;
		return referenceByBar
			.reduce((reducer, value, index) => {
				const subStep = step / value.length;
				return value
					.reduce((subReducer, subValue, subIndex) =>
						subValue === contentByBar[index][subIndex] ?
							subReducer + subStep : subReducer, 0) + reducer;
			}, 0);
	}),
	getInitialState: () => ({ weight: 0, _important: false })
};
