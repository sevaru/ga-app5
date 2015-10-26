import React from 'react';
import { Input, Grid, Col, Row } from 'react-bootstrap';

    
const defaultOptions = {
    deathLimit: 0.5,
    count: 25,
    threshold: 0.8, // End processing when someone near good (best 1)
    maxIterations: 1000,
    mutationProbability: 0.2,
    useRandomInitialIndividuals: true,
    countOfBestToLiveThrought: 0
};

export default class Options extends React.Component {
    constructor(params) {
        super(params);
        this.state = Object.assign({}, defaultOptions, this.props.settings);
    }
    render() {
        return (
            <form>
                {this._renderSlider('deathLimit')}
                {this._renderSlider('count', { min: 1, max: 100, step: 1 })}
                {this._renderSlider('threshold')}
                {this._renderSlider('maxIterations', { min: 1, max: 10000, step: 1 })}
                {this._renderSlider('mutationProbability')}
                {this._renderSlider('countOfBestToLiveThrought', { min: 0, max: 10, step: 1})}
                {this._renderCheckBox('useRandomInitialIndividuals')}
            </form>
        );
    }
    _renderSlider(field, options = { min: 0, max: 1, step: 0.01 }) {
        return (
            <div className="form-group">
                <label>{field} - {this.state[field]}</label>
                <input type="range" value={this.state[field]} min={options.min} step={options.step} max={options.max} onChange={this._baseOnChange.bind(this, {field, type: 'number'})} />
            </div>
        );
    }
    _renderCheckBox(field) {
        return (
            <div className="checkbox">
                <label>
                    <input type="checkbox" checked={this.state[field]} onChange={this._baseOnChange.bind(this, {field, type: 'boolean'})} /> {field}
                </label>
            </div>
        );
    }
    componentWillUpdate(nextProps, nextState) {
        const callback = this.props.onChange;
        if ( typeof callback === 'function' ) {
            callback(nextState);
        }
    }
    _baseOnChange({field, type = 'number'}, e) {
        let value;
        switch ( type ) {
            case 'number':
                value = Number(e.target.value);
                break;
            case 'boolean':
                value = e.target.checked;
                break;
        }
        this.setState({
            [field]: value
        });
    }
}
