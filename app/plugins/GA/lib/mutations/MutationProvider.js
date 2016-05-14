import createProvider from '../common/createProvider';

const context = require.context('./providers', false, /Mutation.js/);
export const {run, Component} = createProvider('mutation', context, true /* random run on every request */);
