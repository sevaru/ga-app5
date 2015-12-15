import React from 'react';
import { Input, Grid, Col, Row } from 'react-bootstrap';
import { stringUtils } from '../plugin/utils.js';


class BaseControl extends React.Component {
	render() {
		throw new Error('Abstract class');
	}

    onChange({ field, type = 'number' }, e ) {
        let value;
        switch ( type ) {
            case 'number':
                value = Number(e.target.value);
                break;
            case 'boolean':
                value = e.target.checked;
                break;
        }

        this.props.onChange(field, value);
    }
}

//{ obj, field, ?title, ?min, ?max}
export class SliderControl extends BaseControl {
	render() {
		//required
		const field = this.props.field;
		//optional
		const title = this.props.title || stringUtils.camelCaseToHuman(this.props.field);
		const min = this.props.min || 0;
		const max = this.props.max || 1;
		const step = this.props.step || 0.1;

		return (
            <div className="form-group">
                <label>{title} - {this.props.value}</label>
                <input 
                	type="range"
                	value={this.props.value}
                	min={min}
                	max={max}
                	step={step}
                	onChange={this.onChange.bind(this, {field, type: 'number'})} />
            </div>
        );
	}
}

export class CheckboxControl extends BaseControl {
	render() {
		//required
		const field = this.props.field;
		//optional
		const title = this.props.title || stringUtils.camelCaseToHuman(this.props.field);
		return (
            <div className="checkbox">
                <label>
                    <input 
                    	type="checkbox"
                    	checked={this.props.value}
                    	onChange={this.onChange.bind(this, {field, type: 'boolean'})} />
                	{title}
                </label>
            </div>
        );
	}
}