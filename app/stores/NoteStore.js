import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
	constructor() {
		this.bindActions(NoteActions)
		this.notes = [];

		this.exportPublicMethods({
			get: this.get.bind(this)
		})
	}
	get(ids) {
		return (ids || [])
			.map(id => this.notes[this._findNote(id)])
			.filter(a => a);
	}
	create(note) {
		const notes = this.notes;
		note.id = uuid.v4();

		this.setState({
			notes: notes.concat(note)
		});
	}
	update({id, task}) {
		let notes = this.notes;
		const noteIndex = this._findNote(id);

		if ( noteIndex < 0 ) {
			return;
		}

		notes[noteIndex].task = task;

		this.setState({ notes });
	}
	delete(id) {
		let notes = this.notes;
		const noteIndex = this._findNote(id);

		if ( noteIndex < 0 ) {
			return;
		}

		this.setState({ 
			notes: this._removeFromArray(notes, noteIndex)
	 	});
	}
	_findNote(id) {
		return this.notes.findIndex(note => note.id === id);
	}
	_removeFromArray(array, index) {
		return array.slice(0, index).concat(array.slice(index + 1));
	}
}

export default alt.createStore(NoteStore, 'NoteStore');