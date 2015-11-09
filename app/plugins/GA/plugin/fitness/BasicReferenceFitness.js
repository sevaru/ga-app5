class BasicReferenceFitness {
	fitness(content, reference) {
		let length = content.length;
		
		return content.reduce((prev, item, index) => {
			return prev + (Number(item === reference[index]) / length);
		}, 0);
	}
}

export default new BasicReferenceFitness();