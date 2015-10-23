import { arrayUtils } from '../utils';

function _defaultWeights( data ) {
	return arrayUtils.make(0.5, data.length);
}

/* 
	#Contract 
	data is an array;
*/
function validate( data, mutationFunc, weightsFunction ) {

	if ( !Array.isArray( data ) ) {
		throw new TypeError('Invalid argument data. Should be an array.');
	}
	
	if ( typeof mutationFunc !== 'function' ) {
		throw new TypeError('Invalid argument mutateFunc. Should be function.');
	}
	
	if ( weightsFunction && typeof weightsFunction !== 'function' ) {
		throw new TypeError('Invalid argument weightsFunction. Should be function.');
	}

}

export default function make( mutationFunc, weightsFunc ) {
	return ( data, options ) => {
		/*Throw on errors*/
		validate( data, mutationFunc, weightsFunc );
		
		options = options || {};
		
		/* Default weights or custom if specified */
		const weights = weightsFunc ? weightsFunc(data) : _defaultWeights(data);
		return mutationFunc(data.slice(), weights, options);
	};
}