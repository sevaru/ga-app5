import { PunctuatedEquilibriumExecutor } from './PunctuatedEquilibriumExecutor';
import { getInitialStateFromMeta } from '../../../common/getInitialStateFromMeta';
import { getRenderFromMeta } from '../../../common/getRenderFromMeta';

const META = {
    environmentChangeWeight: {
        value: 0.3,
        min: 0,
        max: 1
    },
    environmentChangeRate: {
        value: 10,
        min: 0,
        max: 100
    },
    environmentDifferenceWeight: {
        value: 0.3,
        min: 0,
        max: 1
    },
    groupsCount: {
        value: 4,
        min: 1,
        max: 25
    }
};

export default {
    executor: PunctuatedEquilibriumExecutor,
    render: getRenderFromMeta(META),
    name: 'punctuated-equilibrium-evolution',
    getInitialState: getInitialStateFromMeta(META, 1)
};