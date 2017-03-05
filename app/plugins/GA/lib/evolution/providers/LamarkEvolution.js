import React from 'react';
import { createSliderFactory } from '../../../components/UIFactory';
import { GA } from '../../ga/GA';
import { arrayUtils, numberUtils } from '../../utils';
import { EnvironmentChanger } from '../common';

const render =
    (state, onblur) => (
        <div>
            {
                createSliderFactory(state, onblur)([
                    { field: 'adaptationRate' },
                    { field: 'adaptationPercent' },
                    { field: 'maxChildren', max: 10 },
                    { field: 'environmentChangeRate', max: 1000 },
                    { field: 'changeWeight', min: 0, max: 1, step: 0.01 }
                ])
            }
        </div>
    );

class LamarkExecutor extends GA {
    _environmentChanger = new EnvironmentChanger();
    _oneEra() {
        super._oneEra();
        const { adaptationRate, environmentChangeRate } = this._evolution;

        if (this._isOccur(adaptationRate)) {
            this._adaptate();
        }

        if (this._isOccur(environmentChangeRate)) {
            this._changeEnvironment();
        }
    }

    _changeEnvironment() {
        const { changeWeight } = this._evolution;
        this._context = this._environmentChanger.createContext(this._preference, changeWeight);
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
}


export default {
    executor: LamarkExecutor,
    render,
    name: 'lamark-evolution',
    getInitialState: () => ({
        weight: 0.5,

        // Adaptation
        adaptationRate: 10,
        adaptationPercent: 20,
        maxChildren: 4,

        // Environment change
        environmentChangeRate: 70,
        changeWeight: 0.2
    })
};