// 3d Party
import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel } from 'react-bootstrap';

// Local
import { SliderControl, CheckboxControl } from './UIFactory.jsx';

import {Component as CrossoverProvider} from '../lib/crossovers/CrossoverProvider';
import {Component as MutationProvider} from '../lib/mutations/MutationProvider';
import {Component as FitnessProvider} from '../lib/fitness/FitnessProvider';
import {render as GAOptionsComponent} from '../lib/ga/options';

/*
should call render methods on UIProviders

import ProvidersContext from 'providers-context';

ProvidersContext.forEach(() => )
 */

export default ({store}) => (
    <div>
        <GAOptionsComponent store={store} />
        <CrossoverProvider store={store} />
        <MutationProvider store={store} />
        <FitnessProvider store={store} />
    </div>
);

/**
 * @deprecated
 */
class GAOptions_old extends React.Component {
    /**
     * @deprecated
     */
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
            </Panel>
        )
    }
}
