import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel } from 'react-bootstrap';
import { SliderControl, CheckboxControl } from './UIFactory.jsx';
import GALib from '../plugin/GA.js';


class GA {
    constructor() {
        this._options = {
            GA: {
                maxIterations: 250,
                deathLimit: 0.4,
                count: 25,
                threshold: 0.9, /* End processing when someone near good (best 1) */
                mutationProbability: 0.3,
                useRandomInitialIndividuals: true,
                countOfBestToLiveThrought: 2
            },
            mutation: {
                swap2: {
                    weight: 0.25,
                    count: 32
                },
                upAndDown: {
                    weight: 0.5,
                    count: 32
                },
                changeDuration: {
                    weight: 1,
                    count: 7
                }
            },
            crossover: {
                onePointCrossover: 1,
                twoPointCrossover: 0
            },
            fitness: {
                basicReferenceFitness: {
                    on: true
                },
                magnitudeFitness: {
                    on: false
                },
                melodyFitness: {
                    on: false
                },
                intervalFitness: {
                    on: false
                }
            }
        };
    }

    run() {
        const ga = new GALib(this._options);
        return ga.run();
    }

    renderAllOptions() {
        return (
            <div>
                {this._renderOptions()}
                {this._renderMutationOptions()}
                {this._renderCrossoverOptions()}
                {this._renderFitnessOptions()}
            </div>
        );
    }

    onOptionsChange(newState) {
        this._options.GA = newState;
    }

    _renderOptions() {
        const options = this._options.GA;
        return (
            <Panel header="Options">
                <form>
                    <SliderControl onChange={this.onOptionsChange.bind(this)} obj={options} field={'deathLimit'} />
                    <SliderControl onChange={this.onOptionsChange.bind(this)} obj={options} field={'count'} min={1} max={100} step={1} />
                    <SliderControl onChange={this.onOptionsChange.bind(this)} obj={options} field={'threshold'} />
                    <SliderControl onChange={this.onOptionsChange.bind(this)} obj={options} field={'maxIterations'} min={1} max={10000} step={1}/>
                    <SliderControl onChange={this.onOptionsChange.bind(this)} obj={options} field={'mutationProbability'} />
                    <SliderControl onChange={this.onOptionsChange.bind(this)} obj={options} field={'countOfBestToLiveThrought'} min={0} max={10} step={1}/>
                    <CheckboxControl onChange={this.onOptionsChange.bind(this)} obj={options} field={'useRandomInitialIndividuals'} />
                </form>
            </Panel >
        )
    }

    _renderMutationOptions() {
        //TODO: DRY!
        const options = this._options.mutation;
        return (
            <Panel header="Mutations">
                <form>
                    <Panel header="Swap2">
                        <SliderControl onChange={this.onMutationChange.bind(this, 'swap2')} obj={options.swap2} field={'weight'} />
                        <SliderControl onChange={this.onMutationChange.bind(this, 'swap2')} obj={options.swap2} title="Count of genes" field={'count'} min={1} max={128} step={1} />
                    </Panel>

                    <Panel header="UpAndDown">
                        <SliderControl onChange={this.onMutationChange.bind(this, 'upAndDown')} obj={options.upAndDown} field={'weight'} />
                        <SliderControl onChange={this.onMutationChange.bind(this, 'upAndDown')} obj={options.upAndDown} title="Count of genes" field={'count'} min={1} max={128} step={1} />
                    </Panel>

                    <Panel header="ChangeDuration">
                        <SliderControl onChange={this.onMutationChange.bind(this, 'changeDuration')} obj={options.changeDuration} field={'weight'} />
                        <SliderControl onChange={this.onMutationChange.bind(this, 'changeDuration')} obj={options.changeDuration} title="Count of genes" field={'count'} min={1} max={16} step={1} />
                    </Panel>
                </form>
            </Panel >
        )
    }

    onMutationChange(field, newState) {
        this._options.mutation[field] = newState;
    }

    _renderCrossoverOptions() {
        return null;
    }

    _renderFitnessOptions() {
        const options = this._options.fitness;
        return (
            <Panel header="Fitness">
                <form>
                    <Panel header="BasicReference">
                        <CheckboxControl onChange={this.onFitnessChange.bind(this, 'basicReferenceFitness', 'on')} obj={options.basicReferenceFitness} field={'on'} />
                    </Panel>
                    <Panel header="Magnitude">
                        <CheckboxControl onChange={this.onFitnessChange.bind(this, 'magnitudeFitness', 'on')} obj={options.magnitudeFitness} field={'on'} />
                    </Panel>
                    <Panel header="Melody">
                        <CheckboxControl onChange={this.onFitnessChange.bind(this, 'melodyFitness', 'on')} obj={options.melodyFitness} field={'on'} />
                    </Panel>
                    <Panel header="Interval">
                        <CheckboxControl onChange={this.onFitnessChange.bind(this, 'intervalFitness', 'on')} obj={options.intervalFitness} field={'on'} />
                    </Panel>
                </form>
            </Panel >
        )
    }

    onFitnessChange(object, field, newState) {
        //TODO: export _options to state;
        this._options.fitness[object][field] = newState;
    }
}

export default new GA();
