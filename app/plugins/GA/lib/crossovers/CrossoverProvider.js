import createProvider from '../common/createProvider';
import OnePointCrossover from './providers/OnePointCrossover';
import TwoPointCrossover from './providers/TwoPointCrossover';
import RandomCrossover from './providers/RandomCrossover';

export const { run, Component } = createProvider('crossover', [
    OnePointCrossover,
    TwoPointCrossover,
    RandomCrossover
]);
