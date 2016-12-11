import { last } from 'lodash';
import { createCalculate } from '../common/createGroupMutation';
import { availableValuesInGF, PAUSE, HOLD } from '../../../MusicContext';

const MAX_GEN_VALUE = last(availableValuesInGF);

function transposeGen(gen, transposeSize) {
	if ([PAUSE, HOLD].includes(gen)) {
		return gen;
	} 
	const newValue = gen + transposeSize;
	const rem = newValue % MAX_GEN_VALUE;
	return rem ? rem : MAX_GEN_VALUE;
}

export const calculate =
	createCalculate((groups, [indexes], { transposeSize }) => {
		indexes.forEach(i => {
			const chunk = groups.get(i);
			groups.set(i, chunk.map(g => transposeGen(g, transposeSize)));
		});
	});
