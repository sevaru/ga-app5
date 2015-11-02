import React from 'react';
import Player from '../players/soundfont-player/Player.js';
import { Button, ButtonGroup } from 'react-bootstrap';


export class PlayerSource {
	static setInternalFormat(notes) {
		Player.set(notes);
	}
}

export default class PlayerControls extends React.Component {
	render() {
		return (
			<form className="navbar-form navbar-left">
				<ButtonGroup>
					<Button bsStyle="success" onClick={this.play.bind(this)}>
						<span className="glyphicon glyphicon-play"></span>
					</Button>
					<Button bsStyle="danger" onClick={this.stop.bind(this)}>
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