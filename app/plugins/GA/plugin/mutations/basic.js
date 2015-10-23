export default function mutate( data, weights, options ) {
	/* IT DOES'T USE MAP CAUSE OPERATES ON ARRAY NEIGHTBROU ITEMS !!!!!!!!!!!!!!!!!!!!!!!!!!! */
	for ( var i = 0, l = data.length; i < l; i++ ) {
		
		if ( Math.random() < weights[i] ) {
			continue;
		}

		
		/* MUTATION FUNCTION */
		if ( i === data.length - 1) {
			continue;
		}

		const temp = data[i + 1];

		data[i + 1] = data[i];
		data[i] = temp;
	}

	return data;
}
