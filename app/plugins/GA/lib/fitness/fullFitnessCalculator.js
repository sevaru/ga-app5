import { plugins } from './plugins';

/**
 * @param { { [fitnessName: string]: { weight: number, [optionName: string]: any } } } fitnessOptions 
 * @param { Array<number> } content 
 * @param { Array<number> } reference 
 * @returns { { [fitnessName: string]: number } } 
 */
export const fullFitnessCalculator =
    (fitnessOptions, content, reference) =>
        plugins
            .reduce((store, { run, name }) =>
                ({
                    ...store,
                    [name]: run(content, reference, fitnessOptions[name])
                }), {});