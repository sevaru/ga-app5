import createProvider from '../common/createProvider';

import changeDurationMutation from './providers/changeDurationMutation';
import copyPasteMutation from './providers/copyPasteMutation';
import orderMutation from './providers/orderMutation';
import randomMutation from './providers/randomMutation';
import reverseMutation from './providers/reverseMutation';
import sortMutation from './providers/sortMutation';
import swap2Mutation from './providers/swap2Mutation';
import swapGroupMutation from './providers/swapGroupMutation';
import transposeMutation from './providers/transposeMutation';
import upAndDownMutation from './providers/upAndDownMutation';

export const {run, Component} = createProvider('mutation', [
    changeDurationMutation,
    copyPasteMutation,
    orderMutation,
    randomMutation,
    reverseMutation,
    sortMutation,
    swap2Mutation,
    swapGroupMutation,
    transposeMutation,
    upAndDownMutation
], true /* random run on every request */);
