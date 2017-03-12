import { KimuraExecutor } from './KimuraExecutor';
import { getInitialStateFromMeta } from '../../../common/getInitialStateFromMeta';
import { getRenderFromMeta } from '../../../common/getRenderFromMeta';

const META = {
    similarityThreshold: {
        value: 0.3,
        min: 0,
        max: 1
    },
    speciesCount: {
        value: 2,
        min: 2,
        max: 10
    },
    speciesSeparationRate: {
        value: 10,
        min: 10,
        max: 1000
    }
};

export default {
    executor: KimuraExecutor,
    render: getRenderFromMeta(META),
    name: 'kimura-evolution',
    getInitialState: getInitialStateFromMeta(META, 0.5)
};