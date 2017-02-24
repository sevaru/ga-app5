import { createRenderComponent } from '../common/createRenderComponent';
import { createPluginsHash } from '../common/createPluginsHash';
import rootState from '../../../../store/initialState';

// NOTE: list of available evolutions
import DarwinEvolution from './providers/DarwinEvolution';
import LamarkEvolution from './providers/LamarkEvolution';
// import VriesEvolution from './providers/VriesEvolution';
// import KimuraEvolution from './providers/KimuraEvolution';
// import PunctuatedEquilibriumEvolution from './providers/PunctuatedEquilibriumEvolution';

const EVOLUTION_KEY = 'evolution';

// TODO: export somewhere, copy paste from BaseCalculateProvider
function registerInStore(providerName, initialState, plugins) {
    initialState[providerName] = {};
    Object
        .keys(plugins)
        .map(key => plugins[key])
        .forEach(({ name, getInitialState }) =>
            initialState[providerName][name] = getInitialState());
    console.log(initialState);
}


function createEvolutionProvider(evolution) {
    const plugins = createPluginsHash(evolution);
    registerInStore(EVOLUTION_KEY, rootState.GA, plugins);
    const Component = createRenderComponent(EVOLUTION_KEY, plugins, { expanded: true });

    return {
        Component,
        plugins
    };
}

export const { Component, plugins } = createEvolutionProvider([
    DarwinEvolution,
    LamarkEvolution,
    // VriesEvolution,
    // KimuraEvolution,
    // PunctuatedEquilibriumEvolution
]);