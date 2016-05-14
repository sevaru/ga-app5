import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel } from 'react-bootstrap';
import { SliderControl, CheckboxControl } from '../../components/UIFactory.jsx';
import {changeOptions} from '../../actions/index';

/**
 * @description pluginKey = crossover | mutation | fitness
 */
export const createRenderComponent = (pluginKey, plugins) => {
	return ({ store }) => {
		const state = store.getState().GA[pluginKey];

		const onblur = (name, field, value) => {
			store.dispatch(
				changeOptions([pluginKey, name, field], value)
			);
		};
		const options = Object
			.keys(plugins)
			.map((name) => {
				const plugin = plugins[name];
				const innerMarkup = plugin.render && plugin.render(state[name], onblur.bind(null, name));
				return (
					<Panel header={name} key={name}>
		                <SliderControl
		                	defaultValue={state[name].weight}
		                	onBlur={onblur.bind(null, name)}
		                	field={'weight'} />
		                {innerMarkup}
		            </Panel>
	            );
			});

		return (
			<Panel header={pluginKey + ' options'}>
                {options}
            </Panel>
		);
	};
};