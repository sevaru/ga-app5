import createProvider from '../common/createProvider';

const context = require.context('./providers', false, /Crossover.js/);
export const {run, Component} = createProvider('crossover', context);
