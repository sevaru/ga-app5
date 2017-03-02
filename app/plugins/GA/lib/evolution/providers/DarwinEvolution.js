import { GA } from '../../ga/GA';

export default {
    executor: GA,
    name: 'darwin-evolution',
    getInitialState: () => ({ weight: 0/*0.5*/ })
};