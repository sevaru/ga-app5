import { GA } from '../../../ga/GA';
import { fullFitnessCalculator } from '../../../fitness/fullFitnessCalculator';
import { KimuraIndividual } from './KimuraIndividual'

export class KimuraExecutor extends GA {
    /**
     * @type { { speciesSeparationRate: number, similarityThreshold: number, speciesCount: number } }
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
        const fitnessOptions = this._preference.fitness;

        /**
         * @type { KimuraIndividual[] }
         */
        const kimuraPopulation = this._population.map(x => {
            return KimuraIndividual.fromIndividual(x, fitnessOptions);
        });

        const groups = kimuraPopulation.reduce((store, x) => {
            const [maxFitnessName] = Object.entries(x.fitnessValues).reduce((prevMaxPair, [name, value]) => {
                if (!prevMaxPair) {
                    return [name, value];
                }
                return value > prevMaxPair[1] ? [name, value] : prevMaxPair;
            }, null);

            return { 
                ...store,
                [maxFitnessName]: (store[maxFitnessName] || []).concat(x)  
            };
        }, {});

        debugger;

        /*
        1. Вначале разбиваем на столько групп сколько фитнессов.
        2. Выбираем самый большой фитесс и кладем в эту группу
        3. Сортируем поциков внутри групп по общему фитнесу
        4. Режем группы
        5. Делаем детей
         */
    }
}