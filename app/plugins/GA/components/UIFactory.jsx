import React from 'react';
import { stringUtils } from '../lib/utils.js';


class BaseControl extends React.Component {
    render() {
        throw new Error('Abstract class');
    }

    onBlur({ field, type = 'number' }, e) {
        let value;
        switch (type) {
            case 'number':
                value = Number(e.target.value);
                break;
            case 'boolean':
                value = e.target.checked;
                break;
        }

        this.props.onBlur(field, value);
    }
}

//{ obj, field, ?title, ?min, ?max}
export class SliderControl extends BaseControl {
    constructor(params) {
        super(params);
        const { field, defaultValue } = this.props;
        this.state = { value: defaultValue };
        this.blurBinded = this.onBlur.bind(this, { field, type: 'number' });
    }

    onChange = event => {
        this.setState({ value: event.target.value });
    }

    render() {
        //optional
        const title = this.props.title || stringUtils.camelCaseToHuman(this.props.field);
        const min = this.props.min || 0;
        const max = this.props.max || 1;
        const step = this.props.step || 0.01;

        return (
            <div className="form-group">
                <label>{title} - {this.state.value}</label>
                <input
                    type="range"
                    value={this.state.value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={this.onChange}
                    onBlur={this.blurBinded} />
            </div>
        );
    }
}

export class CheckboxControl extends BaseControl {
    constructor(params) {
        super(params);
        this.state = { value: this.props.defaultValue };
    }

    onChange(event) {
        this.setState({ value: event.target.value });
    }

    render() {
        const {field, defaultValue, title} = this.props;
        const actualTitle = title || stringUtils.camelCaseToHuman(field);
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        defaultChecked={defaultValue}
                        onChange={this.onChange.bind(this)}
                        onBlur={this.onBlur.bind(this, { field, type: 'boolean' })} />
                    {actualTitle}
                </label>
            </div>
        );
    }
}

export const probabilitySlider = (field) => ({ field, min: 0, max: 1, step: 0.01 });

export const createSliderFactory =
    (state, onblur) =>
        (fields) =>
            fields.map(
                ({
                    field,
                    title = stringUtils.camelCaseToHuman(field),
                    min = 1,
                    max = 100,
                    step = 1
                }) => (
                        <SliderControl
                            key={field}
                            defaultValue={state[field]}
                            onBlur={onblur}
                            field={field}
                            title={title}
                            min={min}
                            max={max}
                            step={step}
                        />
                    ));
