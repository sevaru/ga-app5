import createProvider from '../common/createProvider';

const context = require.context('./providers', false, /Fitness.js/);
export const {run, Component} = createProvider('fitness', context);
