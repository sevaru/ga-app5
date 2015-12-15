const defaultOptions = {
	GA: {
        maxIterations: 250,
        deathLimit: 0.4,
        count: 25,
        threshold: 0.9, /* End processing when someone near good (best 1) */
        mutationProbability: 0.3,
        useRandomInitialIndividuals: true,
        countOfBestToLiveThrought: 2
    },
    mutation: {
        swap2: {
            weight: 0.25,
            count: 32
        },
        upAndDown: {
            weight: 0.5,
            count: 32
        },
        changeDuration: {
            weight: 1,
            count: 7
        }
    },
    crossover: {
        onePointCrossover: 1,
        twoPointCrossover: 0
    },
    fitness: {
        basicReferenceFitness: {
            on: true
        },
        magnitudeFitness: {
            on: false
        },
        melodyFitness: {
            on: false
        },
        intervalFitness: {
            on: false
        }
    }
};

export default defaultOptions;