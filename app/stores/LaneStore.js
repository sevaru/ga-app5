import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import NoteStore from './NoteStore';
import update from 'react/lib/update';
import {removeFromArray} from '../libs/utils';

class LaneStore {
	constructor() {
		this.bindActions(LaneActions);
		this.lanes = [];
	}
	create(lane) {
		const lanes = this.lanes;
		lane.id = uuid.v4();
		lane.notes = lane.notes || [];

		this.setState({
			lanes: lanes.concat(lane)
		});
	}
	update({ id, name }) {
		const lanes = this.lanes;
		const targetId = this._findLane(id);

		if ( targetId < 0 ) {
			return;
		}

		lanes[targetId].name = name;
	}
	delete(id) {
		const lanes = this.lanes;
		const targetId = this._findLane(id);

		if ( targetId < 0 ) {
			return;
		}

		this.setState({
			lanes: removeFromArray(lanes, targetId)
		});
	}
 	attachToLane({ laneId, noteId }) {
		if ( !noteId ) {
			this.waitFor(NoteStore);
			//Creepy way of get last item
			noteId = NoteStore.getState().notes.slice(-1)[0].id
		}

		const lanes = this.lanes;
		const targetId = this._findLane(laneId);

		if ( targetId < 0 ) {
			return;
		}

		this._removeNote(noteId);

		const lane = lanes[targetId];

		if ( lane.notes.indexOf(noteId) === -1 ) {
			lane.notes.push(noteId);

			this.setState({ lanes });
		} else {
			console.warn('Already attached note to lane', lanes);
		}
	}
	/*detachFromLane({ laneId, noteId }) {
		const lanes = this.lanes;
		const targetId = this._findLane(laneId);

		if ( targetId < 0 ) {
			return;
		}

		const lane = lanes[targetId];
		const notes = lane.notes;
		const removeIndex = notes.indexOf(noteId);

		if ( removeIndex !== -1 ) {
			lane.notes = removeFromArray(notes, removeIndex);
			this.setState({ lanes });
		} else {
			console.warn('Failed to remove note from lane as it did\'t exist', lanes);
		}
	}*/
	move({ sourceId, targetId }) {
		const lanes = this.lanes;
		const sourceLane = this._findLaneByNote(sourceId);
		const targetLane = this._findLaneByNote(targetId);

		const sourceNoteIndex = sourceLane.notes.indexOf(sourceId);
		const targetNoteIndex = targetLane.notes.indexOf(targetId);

		if ( sourceLane === targetLane ) {
			this._moveInLane(sourceLane, sourceId, sourceNoteIndex, targetNoteIndex);
		} else {
			this._moveToAnotherLane(sourceLane, targetLane, sourceId, sourceNoteIndex, targetNoteIndex);
		}

		this.setState({ lanes });
	}
	_removeNote(noteId) {
		const lanes = this.lanes;
		const lane = this._findLaneByNote(noteId);
		if ( !lane ) {
			return;
		}

		const removeNoteIndex = lane.notes.indexOf(noteId);
		lane.notes = removeFromArray(lane.notes, removeNoteIndex);
	}
	_moveInLane(lane, id, fromIndex, toIndex) {
		lane.notes = update(lane.notes, {
			$splice: [
				[fromIndex, 1],
				[toIndex, 0, id]
			]
		});
	}
	_moveToAnotherLane(fromLane, toLane, id, fromIndex, toIndex) {
		fromLane.notes.splice(fromIndex, 1);
		toLane.notes.splice(toIndex, 0, id);
	}
	_findLaneByNote(id) {
		const lanes = this.lanes;
		return lanes.find(lane => {
      		return lane.notes.indexOf(id) >= 0;
	    });
	}
	_findLane(id) {
		const lanes = this.lanes;
		const laneIndex = lanes.findIndex(lane => lane.id === id);

		if ( laneIndex < 0 ) {
			console.warn('Failed to find lane', lanes, id);
		}

		return laneIndex;
	}

}

export default alt.createStore(LaneStore, 'LaneStore');