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