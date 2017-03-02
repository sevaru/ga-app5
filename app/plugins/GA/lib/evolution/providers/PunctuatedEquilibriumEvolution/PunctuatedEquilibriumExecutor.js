import { SimpleGARunner } from '../../../ga/SimpleGARunner';

export class PunctuatedEquilibriumExecutor {

    /**
     * @param {{ options: {}, evolution: { groupsCount: number, environmentChangeWeight: number, environmentChangeRate: number, environmentDifferenceWeight: number }, crossover: {}, mutation: {}, fitness: {} }} preferences
     */
    constructor(preferences, workerOptions = {}, reference, id) {
        /**
         * 
         * 1. create multiple garunners (for each group)
         * 2. how to handle many onDone, onPause, onProgress?
         * 3. store current populations .. and send new on every progress from
         * 
         * 
         * for pause use flags ?
         * 
         */

         const groupsCount = preferences.evolution.groupsCount;
         debugger;

         new SimpleGARunner(preferences, workerOptions, reference);
        
    }
}