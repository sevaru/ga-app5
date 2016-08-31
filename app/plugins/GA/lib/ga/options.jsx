import React from 'react';
import {Panel} from 'react-bootstrap';
import { SliderControl, CheckboxControl } from '../../components/UIFactory.jsx';
import {changeOptions} from '../../actions/index';
import rootState from '../../../../store/initialState';

const NAMESPACE = 'options';

rootState.GA[NAMESPACE] = {
	maxIterations: 500,
    deathLimit: 0.2,
    count: 100,
    threshold: 0.9, /* End processing when someone near good (best 1) */
    mutationProbability: 0.5,
    useRandomInitialIndividuals: true,
    countOfBestToLiveThrought: 0,
    stopOnEndOfIterations: true
};

const createSliderFactory =
	(state, onblur) => 
		(field, props) => (
			<SliderControl 
				defaultValue={state[field]}
				onBlur={onblur}
				field={field}
				{...props}
			/>
		);



export const render = (props) => {
	const { store } = props;
	const state = store.getState().GA[NAMESPACE];
	const onblur = (field, value) => {
		store.dispatch(
			changeOptions([NAMESPACE, field], value)
		);
	};
	const createSlider = createSliderFactory(state, onblur);
	
	return (
		<Panel collapsible defaultExpanded header="Options">
			{createSlider('maxIterations', {max: 10000, min: 50, step: 10})}
			{createSlider('deathLimit')}
			{createSlider('count', {max: 500, min: 25, step: 1})}
			{createSlider('threshold')}
			{createSlider('mutationProbability')}
			{createSlider('countOfBestToLiveThrought', {max: 10, min: 0, step: 1})}
		 	<CheckboxControl
	            onBlur={onblur}
	            defaultValue={state['useRandomInitialIndividuals']}
	            field={'useRandomInitialIndividuals'} />
            <CheckboxControl
	            onBlur={onblur}
	            defaultValue={state['stopOnEndOfIterations']}
	            field={'stopOnEndOfIterations'} />
        </Panel>
	);
};