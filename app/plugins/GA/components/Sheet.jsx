import React from 'react';
import ABCJS from 'ABCJS';
import convertToABC from '../plugin/utils/convertToABC';

export default class Sheet extends React.Component {
	constructor(params) {
		super(params);
		this._element = null;
	}
	componentDidMount() {
	    this._element = this.refs.abcjs;
	}
	componentWillReceiveProps(nextProps) {
		if ( !nextProps.data ) {
			return;
		}

		ABCJS.renderAbc(this._element, convertToABC(nextProps.data), null, {
			scale: 1
		});	
	}
	render() {
		return <div ref="abcjs"></div>
	}
}