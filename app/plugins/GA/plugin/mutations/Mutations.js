import { arrayUtils } from '../utils';
import make from './Mutator';
import { CONFIG_MUTATIONS_UP_AND_DOWN } from '../common.js';


//Runtime
import basic from './basic'; 
import upAndDown from './upAndDown';


const Mutations = {
	basic: make(basic),
	upAndDown: make(upAndDown, data => {
		return arrayUtils.make(CONFIG_MUTATIONS_UP_AND_DOWN, data.length);
	})
};

export default Mutations;