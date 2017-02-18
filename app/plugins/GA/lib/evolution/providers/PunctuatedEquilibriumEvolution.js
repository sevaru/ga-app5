import React from 'react';
import { createSliderFactory } from '../../../components/UIFactory';

const render =
    (state, onblur) => (
        <div>
            {
                createSliderFactory(state, onblur)([
                    { field: 'environmentChangeProbability', min: 0, max: 1, step: 0.01 },
                    { field: 'groupCount', min: 1, max: 25 },
                    { field: 'operatorsChangeRate', min: 1, max: 100 },
                ])
            }
        </div>
    );

export default {
    render,
    name: 'punctuated-equilibrium-evolution',
    getInitialState: () => ({
        weight: 0.3,
        environmentChangeProbability: 0.2,
        operatorsChangeRate: 3,
        groupCount: 4
    })
};