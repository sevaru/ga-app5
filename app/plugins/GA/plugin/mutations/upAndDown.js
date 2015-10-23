export default function mutate( data, weights, options ) {
	return data.map((item, i) => {
		if ( Math.random() < weights[i] ) {
			return item;
		}

		if ( Math.random() > 0.5 ) {
			//TODO: export to common END
			if ( item < 14 ) {
				return item + 1;
			}

			return item;
		} else {
			//TODO: export to common START
			if ( item > 2 ) {
				return item - 1;
			}

			return item;
		}

	});
};