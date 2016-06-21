import { createCompositeProvider } from '../common/createProvider';

const context = require.context('./providers', false, /Fitness.js/);
export const {run, Component} = createCompositeProvider('fitness', context);
