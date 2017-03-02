import React from 'react';
import { createSliderFactory, probabilitySlider } from '../../../components/UIFactory';
import { GA } from '../../ga/GA';
import { selectionUtils, arrayUtils, numberUtils } from '../../utils';
import { EnvironmentChanger } from '../common';

class VriesExecutor extends GA {
    _environmentChanger = new EnvironmentChanger();

    _oneEra() {
        super._oneEra();
        const { catastropheRate } = this._evolution;

        if (this._isOccur(catastropheRate)) {
            this._catastrophe();
        }
    }

    _catastrophe() {
        const { mutationCatastropheWeight, deadCatastropheWeight, environmentCatastropheWeight } = this._evolution;

        const catastropheKey = this._getCatastropheKey();

        switch (catastropheKey) {
            case 'mutation':
                this._mutationCatastrophe(mutationCatastropheWeight);
                break;
            case 'dead':
                this._deadCatastrophe(deadCatastropheWeight);
                break;
            case 'environment':
                this._environmentCatastrophe(environmentCatastropheWeight);
                break;
        }
    }

    _getCatastropheKey() {
        const { mutationCatastropheProbability, deadCatastropheProbability, environmentCatastropheProbability } = this._evolution;
        return selectionUtils.getRandomKey(
            {
                mutationCatastropheProbability,
                deadCatastropheProbability,
                environmentCatastropheProbability
            }
        ).replace('CatastropheProbability', '');
    }

    /**
     * @param {number} weight - from 0 to 1
     */
    _mutationCatastrophe(weight) {
        console.log('Mutation Catastrophe Occurs!');
        if (!weight) {
            return;
        }

        this._options.mutationProbability = numberUtils.strip(this._options.mutationProbability + weight); 
    }

    /**
     * @param {number} weight - from 0 to 1
     */
    _deadCatastrophe(weight) {
        console.log('Dead Catastrophe Occurs!');
        if (!weight) {
            return;
        }
        const populationSize = this._population.length;
        const howMuchWouldDie = Math.floor(weight * populationSize);

        if (!howMuchWouldDie) {
            return;
        }

        /**
         * @type {Array<number>}
         */
        const indexesToRemove = arrayUtils.getRandomIndexes(howMuchWouldDie, populationSize);
        const stippedPopulation = this._population.filter((_, i) => !indexesToRemove.includes(i));
        this._population =
            this._createNewPopulation(stippedPopulation);
    }

    /**
     * @param {number} weight - from 0 to 1
     */
    _environmentCatastrophe(weight) {
        console.log('Environmental Catastrophe Occurs!');
        if (!weight) {
            return;
        }
        this._context = this._environmentChanger.createContext(this._preference, weight);
    }
}

const render =
    (state, onblur) => (
        <div>
            {
                createSliderFactory(state, onblur)([
                    { field: 'catastropheRate', min: 0, max: 100 },
                    probabilitySlider('mutationCatastropheProbability'),
                    probabilitySlider('mutationCatastropheWeight'),
                    probabilitySlider('deadCatastropheProbability'),
                    probabilitySlider('deadCatastropheWeight'),
                    probabilitySlider('environmentCatastropheProbability'),
                    probabilitySlider('environmentCatastropheWeight'),
                ])
            }
        </div>
    );

export default {
    render,
    executor: VriesExecutor,
    name: 'vries-evolution',
    getInitialState: () => ({
        weight: 0, // 0.2
        catastropheRate: 10,
        mutationCatastropheProbability: 0.2,
        mutationCatastropheWeight: 0.3,
        deadCatastropheProbability: 0.2,
        deadCatastropheWeight: 0.3,
        environmentCatastropheProbability: 0.2,
        environmentCatastropheWeight: 0.3
    })
};