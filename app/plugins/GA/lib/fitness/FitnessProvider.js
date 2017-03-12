import { createCompositeProvider } from '../common/createProvider';
import { plugins } from './plugins';

export const { run, Component } = createCompositeProvider('fitness', plugins);
