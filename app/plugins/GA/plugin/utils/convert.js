/*
!assumptations 
1/8 as a default length
c maj as a default key
*/
const n = '\n';
const defaultHeader =  'X:1' + n +
	'T:' + ' Abc' + n +
	'M:4/4' + n + 
	'C:GA' + n +
	'K:D' + n + 
	'L:1/8' + n;

const referenceTable = {
	0: 'Z',
	1: 'C',
	2: 'D',
	3: 'E',
	4: 'F',
	5: 'G',
	6: 'A',
	7: 'B',
	8: 'c',
	9: 'd',
	10: 'e',
	11: 'f',
	12: 'g',
	13: 'a',
	14: 'b'
}; 

function createNote( noteIndex, size ) {
	if ( noteIndex == null ) {
		return '';
	}
	return referenceTable[noteIndex] + size;
}

export default function convert( source ) {
	let answer = defaultHeader;
	
	let previousNote = null;
	let size = 1;
	
	for ( let i = 0, l = source.length; i < l; i++ ) {
		let item = source[i];
		
		if ( item === -1 ) {
			size++;
		} else {
			answer += createNote(previousNote, size);
			previousNote = item;
			size = 1;
		}
		
		//last note
		if ( i === source.length - 1 ) {
			answer += createNote(previousNote, size);
		}
		
		if ( i && i % 8 === 0 ) {
			answer += '|';
		}

		if ( i && i % 32 === 0 ) {
			answer += '\n';
		}
	}
	return answer;
}