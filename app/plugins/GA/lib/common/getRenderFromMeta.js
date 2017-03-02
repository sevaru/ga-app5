import React from 'react';
import { createSliderFactory } from '../../components/UIFactory';

export const getRenderFromMeta =
    (meta) =>
        (state, onblur) =>
            (
                <div>
                    {
                        createSliderFactory(state, onblur)(
                            Object
                                .entries(meta)
                                .map(([field, { min, max }]) =>
                                    ({
                                        field,
                                        min,
                                        max,
                                        step: max === 1 ? 0.01 : 1
                                    })))
                    }
                </div>
            );