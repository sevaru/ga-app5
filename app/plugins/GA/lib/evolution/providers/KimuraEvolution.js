import React from 'react';
import { createSliderFactory } from '../../../components/UIFactory';
import { GA } from '../../ga/GA';

const render =
    (state, onblur) => (
        <div>
            {
                createSliderFactory(state, onblur)([
                    { field: 'distance', min: 0, max: 1, step: 0.01 },
                    { field: 'speciesCount', min: 2, max: 10 },
                ])
            }
        </div>
    );

export default {
    executor: GA,
    render,
    name: 'kimura-evolution',
    getInitialState: () => ({
        weight: 0.3,
        distance: 0.2,
        speciesCount: 3
    })
};