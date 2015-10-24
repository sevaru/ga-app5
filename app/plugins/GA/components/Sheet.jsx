import React from 'react';
import ABCJS from 'ABCJS';

export default class Sheet extends React.Component {
	constructor(params) {
		super(params);
		this._element = null;
	}
	componentDidMount() {
	    this._element = this.refs.abcjs;
	}
	componentWillUpdate(nextProps, nextState) {
		if ( !nextProps.abc ) {
			return;
		}

		ABCJS.renderAbc(this._element, nextProps.abc, null, {
			scale: 1
		});
	}
	render() {
		return <div ref="abcjs"></div>
	}
}