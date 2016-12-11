import MusicContext from '../../../MusicContext';

const INTERVAL_TYPE_VALUES = [
	{
		PERFECT_CONSONANTS: 1,
		IMPERFECT_CONSONANTS: 2,
		SECONDS: 3,
		SEVENTH: 3,
		GRATER_THAN_OCTAVE: 5
	},
	{
		PERFECT_CONSONANTS: 1,
		IMPERFECT_CONSONANTS: 3,
		SECONDS: 1,
		SEVENTH: 3,
		GRATER_THAN_OCTAVE: 5
	}
];

//0, 1
function getIntervalValue( interval, type = 0 ) {
	const values = {
		//Perfect consonants
		0: INTERVAL_TYPE_VALUES[type].PERFECT_CONSONANTS,  //unison
		5: INTERVAL_TYPE_VALUES[type].PERFECT_CONSONANTS,  //perfect fourth
		7: INTERVAL_TYPE_VALUES[type].PERFECT_CONSONANTS,  //perfect fifth
		12: INTERVAL_TYPE_VALUES[type].PERFECT_CONSONANTS, //octave

		//Imperfect consonants
		3: INTERVAL_TYPE_VALUES[type].IMPERFECT_CONSONANTS,  // min third
		4: INTERVAL_TYPE_VALUES[type].IMPERFECT_CONSONANTS,  // maj third
		8: INTERVAL_TYPE_VALUES[type].IMPERFECT_CONSONANTS,  // min sixth
		9: INTERVAL_TYPE_VALUES[type].IMPERFECT_CONSONANTS,  // big sixth

		//Seconds
		1: INTERVAL_TYPE_VALUES[type].SECONDS,  //min second
		2: INTERVAL_TYPE_VALUES[type].SECONDS,  //maj second
		
		//Sevenths
		10: INTERVAL_TYPE_VALUES[type].SEVENTH,  //min seventh
		11: INTERVAL_TYPE_VALUES[type].SEVENTH,  //maj seventh

		//More then octave
		6: INTERVAL_TYPE_VALUES[type].GRATER_THAN_OCTAVE,
		'-1': INTERVAL_TYPE_VALUES[type].GRATER_THAN_OCTAVE
	};

	if ( interval > 12 ) {
		return values[-1];
	}

	return values[interval];
}

export function getValueBetweenNotes( noteA, noteB, mode = 0 ) {
	// assume that noteA, noteB are not PAUSE or HOLD;
	const halfTones = MusicContext.getHalfTonesBeetween(noteA, noteB);
	const intervalValue = getIntervalValue(halfTones, mode);
	return intervalValue;
}

export const MAX_AVERAGE_DIFF = 4;
export const MAX_DISPERSION_DIFF = MAX_AVERAGE_DIFF * MAX_AVERAGE_DIFF;  
