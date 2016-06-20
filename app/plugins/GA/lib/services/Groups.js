import { range, chunk, flatten } from 'lodash';

export class Groups {
	static create(data: Array<number>, size: number, offset: number = 0) {
		return new Groups(data, size, offset);
	}

	constructor(data: Array<number>, size: number, offset: number = 0) {
		this._chunks = this._createChunks(data, size, offset);
	}

	swap(first: Array<number>, second: Array<number>): void {
		const hash = this._arraysToMap(first, second);
		this._chunks = this._chunks
						.map((item, index) => 
							hash[index] == null ? item : this._chunks[hash[index]]);
	}

	length(): number {
		return this._chunks.length;
	}

	get() {
		return this._chunks;
	}

	toRaw(): Array<number> {
		return flatten(this._chunks);
	}

	_createChunks(data, size, offset): Array<Array<number>> {
		const firstChunk = data.slice(0, offset);
		const rest = chunk(data.slice(offset), size);
		return firstChunk.length ? [firstChunk, ...rest] : rest;
	}

	// TODO: maybe export somewhere arrayUtils, objectUtils
	_arraysToMap(first: Array<number>, second: Array<number>): { [id: number]: number }  {
		return first
			.reduce(
				(reducer, value, index) =>
					({ ...reducer, [value]: second[index] })
				, {});
	}
}
