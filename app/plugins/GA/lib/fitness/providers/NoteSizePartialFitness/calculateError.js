import { calculateDiffObject } from './calculateDiffObject';

export const calculateError =
	(objA, objB) =>
		Object
			.values(calculateDiffObject(objA, objB))
			.reduce((prev, current) => prev + current, 0);