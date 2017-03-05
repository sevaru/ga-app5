/**
 * @param {Individual[]} population 
 * @param {number} desc (1 for desc) (-1 for asc) 
 */
export function populationSorter(population, desc = 1) {
    return population.slice().sort((a, b) => {
        const af = a.fitnessValue;
        const bf = b.fitnessValue;

        if (af === bf) {
            return 0;
        }

        return af > bf ? -desc : desc;
    });
}