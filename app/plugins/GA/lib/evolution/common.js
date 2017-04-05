import { numberUtils } from '../utils';
import { run as getCrossover } from '../crossovers/CrossoverProvider';
import { run as getMutation } from '../mutations/MutationProvider';
import { run as getFitness } from '../fitness/FitnessProvider';
import { cloneDeep } from 'lodash';

export class EnvironmentChanger {
    /**
     * @description Change weight property of GO options by reference
     */
    _changeWeights(geneticOperatorOptions, fluctuateRate) {
        Object
            .values(geneticOperatorOptions)
            .forEach(x => {
                x.weight = numberUtils.fluctuate(x.weight, fluctuateRate);
            });
        return geneticOperatorOptions;
    }

    /**
     * @param { { crossover: { weight: number }, mutation: { weight: number }, fitness: { weight: number } } } options
     * @param {number} changeWeight - between 0 and 1
     */
    createContext(options, changeWeight) {
        const { crossover, mutation, fitness } = options;
        return {
            crossover: getCrossover(this._changeWeights(crossover, changeWeight)),
            mutation: getMutation(this._changeWeights(mutation, changeWeight)),
            fitness: getFitness(this._changeWeights(fitness, changeWeight))
        };
    }

    /**
     * @param { { crossover: { weight: number }, mutation: { weight: number }, fitness: { weight: number } } } options
     * @param {number} changeWeight - between 0 and 1
     */
    fluctuateOptions(options, changeWeight) {
        const { crossover, mutation, fitness } = cloneDeep(options);
        return {
            ...options,
            crossover: this._changeWeights(crossover, changeWeight),
            mutation: this._changeWeights(mutation, changeWeight),
            fitness: this._changeWeights(fitness, changeWeight)
        };
    }
}