const run =
	(content, reference) =>
		content.reduce((prev, item, index) =>
		 	prev + (+(item === reference[index]) / content.length), 0);

const getInitialState = () => ({ weight: 1 });

export default {
	name: 'basic-reference-fitness',
	run,
	getInitialState
};
