import React from 'react';
import { createSliderFactory } from '../../../components/UIFactory';

const render =
    (state, onblur) => (
        <div>
            {
                createSliderFactory(state, onblur)([
                    { field: 'catastropheRate', min: 0, max: 100 },
                    { field: 'mutationCatastropheProbability', min: 0, max: 1, step: 0.01 },
                    { field: 'deadCatastropheProbability', min: 0, max: 1, step: 0.01 },
                    { field: 'environmentCatastropheProbability', min: 0, max: 1, step: 0.01 }
                ])
            }
        </div>
    );

export default {
    render,
    name: 'vries-evolution',
    getInitialState: () => ({
        weight: 0.2,
        catastropheRate: 10,
        mutationCatastropheProbability: 0.2,
        deadCatastropheProbability: 0.2,
        environmentCatastropheProbability: 0.2
    })
};