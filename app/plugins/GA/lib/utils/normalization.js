/**
 * Replace holds with pauses
 * @type {Array<Number>}
 */
export const normalizeHolds =
	content => 
		content
		.reduce((store, current) => 
			store.concat(current === -1 ? 0 : current), []);

export const normalizeNotesDiscrete =
	content => 
		content
		.reduce((store, current) => {
			if (current >= 0) {
				store.note = current;
			}
			store.data.push(store.note);
			return store;
		}, { data: [], note: 0 })
		.data;