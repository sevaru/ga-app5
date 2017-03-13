import clusterfck from 'clusterfck';
import { GA } from '../../../ga/GA';
import { Individual } from '../../../Individual';

export class KimuraExecutor extends GA {
    /**
     * @type { { speciesSeparationRate: number, speciesCount: number } }
     */
    _evolution;
    _oneEra() {
        super._oneEra();
        const { speciesSeparationRate } = this._evolution;

        if (this._isOccur(speciesSeparationRate)) {
            this._separate();
        }
    }

    _separate() {
        const { speciesCount } = this._evolution;
        
        // 0. Create clusters
        /**
         * @type { Array<{ Array<number> }> } - array of clusters and its content Individual.content
         */
        const clusters = clusterfck.kmeans(this._population.map(x => x.content));
        const countOfClusters = clusters.length;

        if (speciesCount >= countOfClusters) {
            return;
        }

        /**
         * NOTE: The choice of clusters can be. (TODO: Could be an option later on)
         * 1. By best fitness of random individual in cluster
         * 2. By best fitness in cluster
         * 3. Random
         * ✓ 4. By cluster size
         */

        // 1. Sort by size
        clusters.sort((c1, c2) => c1.length - c2.length);

        // 2. Grab only needed count of clusters
        const clustersToUse = clusters.slice(0, speciesCount);

        // 3. Flatten clusters
        const gensForNewPopulation = clustersToUse.reduce((store, cluster) => [...store, ...cluster], []);

        // 4. Recreate individuals from gens
        const newPopulation = gensForNewPopulation.map(x => new Individual(this._reference, x, null, false, this._context));

        // 5. Recreate population
        this._population = this._createNewPopulation(newPopulation);
    }
}