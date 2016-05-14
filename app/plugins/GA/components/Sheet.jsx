import React from 'react';
import ABCJS from 'ABCJS';
import convertToABC from '../lib/utils/convertToABC';

export default class Sheet extends React.Component {
	constructor(params) {
		super(params);
		this._element = null;
	}

	componentDidMount() {
	    this._element = this.refs.abcjs;
		if ( this.props.data ) {
			this._initializeWidget(this.props.data);
		}
	}

	componentWillReceiveProps(nextProps) {
		if ( !nextProps.data ) {
			return;
		}

		this._initializeWidget(nextProps.data);
	}

	render() {
		return <div ref="abcjs"></div>;
	}

	_initializeWidget(data) {
		ABCJS.renderAbc(this._element, convertToABC(data), null, {
			scale: 1
		});
	}
}