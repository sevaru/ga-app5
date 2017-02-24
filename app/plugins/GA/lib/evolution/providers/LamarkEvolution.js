import React from 'react';
import { createSliderFactory } from '../../../components/UIFactory';
import { GA } from '../../ga/GA';
import { arrayUtils, numberUtils } from '../../utils';
import { run as getCrossover } from '../../crossovers/CrossoverProvider';
import { run as getMutation } from '../../mutations/MutationProvider';
import { run as getFitness } from '../../fitness/FitnessProvider';

const render =
    (state, onblur) => (
        <div>
            {
                createSliderFactory(state, onblur)([
                    { field: 'adaptationRate' },
                    { field: 'adaptationPercent' },
                    { field: 'maxChildren', max: 10 },
                    { field: 'environmentChangeRate', max: 1000 }
                ])
            }
        </div>
    );

class LamarkExecutor extends GA {
    _oneEra() {
        super._oneEra();
        const { adaptationRate, environmentChangeRate } = this._evolution;

        if (this._i % adaptationRate === 0) {
            this._adaptate();
        }

        if (this._i % environmentChangeRate === 0) {
            this._changeEnvironment();
        }
    }

    _adaptate() {
        const { adaptationPercent, maxChildren } = this._evolution;
        const populationSize = this._population.length;
        const adaptantsCount = Math.floor(populationSize * adaptationPercent / 100);

        if (!adaptantsCount) {
            return;
        }

        const indexes = arrayUtils.getRandomIndexes(adaptantsCount, populationSize);
        const goodAdaptants = [];

        indexes.forEach(index => {
            const old = this._population[index];
            const newOne = old.clone();
            newOne.mutate();
            if (newOne.fitnessValue > old.fitnessValue) {
                goodAdaptants.push(newOne);
                this._population[index] = newOne;
            }
        });

        // If we have good adaptants create childrens from them
        if (goodAdaptants.length >= 2) {
            while (goodAdaptants.length > 1) {
                let childrenCount = numberUtils.randomBetween(1, maxChildren);
                const mama = goodAdaptants.pop();
                const papa = goodAdaptants.pop();

                while (childrenCount > 0) {
                    childrenCount--;
                    this._population.push(papa.crossover(mama))
                }
            }

            this._population = this._createNewPopulation(this._population);
        }
    }

    _changeEnvironment() {
        console.log('_changeEnvironment();');
    }
}


export default {
    executor: LamarkExecutor,
    render,
    name: 'lamark-evolution',
    getInitialState: () => ({
        weight: 0.3,
        adaptationRate: 10,
        adaptationPercent: 20,
        maxChildren: 4,
        environmentChangeRate: 100
        // TODO: add change weight how much changed
    })
};