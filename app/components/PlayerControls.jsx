import React from 'react';
import Player from '../players/soundfont-player/Player.js';
import { Button, ButtonGroup } from 'react-bootstrap';

export default class PlayerControls extends React.Component {
	constructor(params) {
		super(params);

		Player.onSet(notes => {
			this.setState({
				enabled: Boolean(notes)
			});
		});

		this.state = {
			enabled: false
		};
	}

	render() {
		return (
			<form className="navbar-form navbar-left">
				<ButtonGroup>
					<Button disabled={!this.state.enabled} onClick={this.play.bind(this)}>
						<span className="glyphicon glyphicon-play"></span>
					</Button>
					<Button disabled={!this.state.enabled} onClick={this.stop.bind(this)}>
						<span className="glyphicon glyphicon-stop"></span>
					</Button>
				</ButtonGroup>
			</form>
		);
	}

	play() {
		Player.play();
	}

	stop() {
		Player.stop();
	}
}