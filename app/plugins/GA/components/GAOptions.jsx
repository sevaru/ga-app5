import React from 'react';
import { Component as CrossoverProvider } from '../lib/crossovers/CrossoverProvider';
import { Component as MutationProvider } from '../lib/mutations/MutationProvider';
import { Component as FitnessProvider } from '../lib/fitness/FitnessProvider';
import { render as GAOptionsComponent } from '../lib/ga/options';
import { Component as EvolutionProvider } from '../lib/evolution/EvolutionProvider';

/*export default ({ store }) => (
    <div>
        <EvolutionProvider store={store} />
        <GAOptionsComponent store={store} />
        <CrossoverProvider store={store} />
        <MutationProvider store={store} />
        <FitnessProvider store={store} />
    </div>
);*/

export default ({ store }) => {
    return (
        <div>
            <EvolutionProvider store={store} />
            <GAOptionsComponent store={store} />
            <CrossoverProvider store={store} />
            <MutationProvider store={store} />
            <FitnessProvider store={store} />
        </div>
    );
};