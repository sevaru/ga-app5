function checkArray( arr ) {
	if ( !Array.isArray(arr) ) {
		throw new TypeError(`arr should be an array ${arr} given.`);
	}
}

function checkObj( obj ) {
	if ( !obj || typeof obj !== 'object' ) {
		throw new TypeError(`obj should be an object ${obj} given`);
	}
}

const numberUtils = {
	randomBetween( one, another ) {
		if ( another === undefined ) {
			another = one;
			one = 0;
		}

		return Math.floor(Math.random() * another) + one;  
	}
};

const arrayUtils = {
	make( value, length ) {
		let arr = [];
		while( length-- ) {
			arr[length] = value;
		}
		return arr;
	},

	randomKey( arr ) {
		checkArray(arr);
		return Math.floor(Math.random() * arr.length);
	},
	
	randomElement( arr ) {
		let randomKey = arrayUtils.randomKey(arr);
		return arr[randomKey];
	},
	
	findObjectByKey( array, field, value ) {
		return array.find(element => element.hasOwnProperty(field) && element[field] === value);
	}
};

const objUtils = {
	randomElement( obj ) {
		checkObj(obj);
		const keys = Object.keys(obj);
		const randomKey = arrayUtils.randomElement(keys);
		return obj[randomKey];
	}
};


export { objUtils, arrayUtils, numberUtils };