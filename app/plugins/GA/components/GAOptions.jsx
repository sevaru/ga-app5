import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel } from 'react-bootstrap';
import { SliderControl, CheckboxControl } from './UIFactory.jsx';
import Individual from '../plugin/Individual.js';
import GAWorker from 'worker!../plugin/GAWorker.js';


export default class GAOptions extends React.Component {
    render() {
        return (
            <div>
                {this._renderOptions()}
                {this._renderMutationOptions()}
                {this._renderCrossoverOptions()}
                {this._renderFitnessOptions()}
            </div>
        );
    }

    _renderOptions() {
        const options = this.props.options.GA;
        return (
            <Panel header="Options">
                <form>
                    <SliderControl onChange={this.props.onChange.bind(this, 'GA')} value={this.props.options.GA.deathLimit} field={'deathLimit'} />
                    <SliderControl onChange={this.props.onChange.bind(this, 'GA')} value={this.props.options.GA.count} field={'count'} min={1} max={100} step={1} />
                    <SliderControl onChange={this.props.onChange.bind(this, 'GA')} value={this.props.options.GA.threshold} field={'threshold'} />
                    <SliderControl onChange={this.props.onChange.bind(this, 'GA')} value={this.props.options.GA.maxIterations} field={'maxIterations'} min={1} max={100000} step={1}/>
                    <SliderControl onChange={this.props.onChange.bind(this, 'GA')} value={this.props.options.GA.mutationProbability} field={'mutationProbability'} />
                    <SliderControl onChange={this.props.onChange.bind(this, 'GA')} value={this.props.options.GA.countOfBestToLiveThrought} field={'countOfBestToLiveThrought'} min={0} max={10} step={1}/>
                    <CheckboxControl onChange={this.props.onChange.bind(this, 'GA')} value={this.props.options.GA.useRandomInitialIndividuals} field={'useRandomInitialIndividuals'} />
                </form>
            </Panel>
        )
    }
    
    _renderCrossoverOptions() {
        return null;
    }

    _renderMutationOptions() {
        const options = this.props.options.mutation;
        return (
            <Panel header="Mutations">
                <form>
                    <Panel header="Swap2">
                        <SliderControl onChange={this.props.onChange.bind(this, 'mutation.swap2')} value={this.props.options.mutation.swap2.weight} field={'weight'} />
                        <SliderControl onChange={this.props.onChange.bind(this, 'mutation.swap2')} value={this.props.options.mutation.swap2.count} title="Count of genes" field={'count'} min={1} max={128} step={1} />
                    </Panel>

                    <Panel header="UpAndDown">
                        <SliderControl onChange={this.props.onChange.bind(this, 'mutation.upAndDown')} value={this.props.options.mutation.upAndDown.weight} field={'weight'} />
                        <SliderControl onChange={this.props.onChange.bind(this, 'mutation.upAndDown')} value={this.props.options.mutation.upAndDown.count} title="Count of genes" field={'count'} min={1} max={128} step={1} />
                    </Panel>

                    <Panel header="ChangeDuration">
                        <SliderControl onChange={this.props.onChange.bind(this, 'mutation.changeDuration')} value={this.props.options.mutation.changeDuration.weight} field={'weight'} />
                        <SliderControl onChange={this.props.onChange.bind(this, 'mutation.changeDuration')} value={this.props.options.mutation.changeDuration.count} title="Count of genes" field={'count'} min={1} max={16} step={1} />
                    </Panel>
                </form>
            </Panel >
        )
    }

    _renderFitnessOptions() {
        const options = this.props.options.fitness;
        return (
            <Panel header="Fitness">
                <form>
                    <Panel header="BasicReference">
                        <CheckboxControl onChange={this.props.onChange.bind(this, 'fitness.basicReferenceFitness')} value={this.props.options.fitness.basicReferenceFitness.on} field={'on'} />
                    </Panel>
                    <Panel header="Magnitude">
                        <CheckboxControl onChange={this.props.onChange.bind(this, 'fitness.magnitudeFitness')} value={this.props.options.fitness.magnitudeFitness.on} field={'on'} />
                    </Panel>
                    <Panel header="Melody">
                        <CheckboxControl onChange={this.props.onChange.bind(this, 'fitness.melodyFitness')} value={this.props.options.fitness.melodyFitness.on} field={'on'} />
                    </Panel>
                    <Panel header="Interval">
                        <CheckboxControl onChange={this.props.onChange.bind(this, 'fitness.intervalFitness')} value={this.props.options.fitness.intervalFitness.on} field={'on'} />
                    </Panel>
                </form>
            </Panel >
        )
    }
}
