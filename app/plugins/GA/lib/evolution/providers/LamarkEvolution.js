import React from 'react';
import { createSliderFactory } from '../../../components/UIFactory';
import { BaseGA } from '../../ga/BaseGA';

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

class KimuraExecutor extends BaseGA {
    _oneEra() {
        debugger;
    }
}

export default {
    render,
    name: 'lamark-evolution',
    executor: KimuraExecutor,
    getInitialState: () => ({
        weight: 0.3,
        adaptationRate: 10,
        adaptationPercent: 20,
        maxChildren: 4,
        environmentChangeRate: 100
    })
};