import { Individual } from '../../../Individual';
import { fullFitnessCalculator } from '../../../fitness/fullFitnessCalculator';

/**
 * @class Helper class with full fitness values to determine species
 */
export class KimuraIndividual extends Individual {

    /**
     * @type { { [fitnessName: string]: number } }
     */
    _fitnessValues = {};

    constructor(reference, content, context, fitnessOptions) {
        super(reference, content, null, false, context);
        this._fitnessValues = fullFitnessCalculator(fitnessOptions, this.content, this.reference);
    }

    get fitnessValues() {
        return this._fitnessValues;
    }

    static fromIndividual(individual, fitnessOptions) {
        return new KimuraIndividual(individual.reference, individual.content, individual.context, fitnessOptions);
    }
}