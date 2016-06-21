import { createGroupMutation } from './common/createGroupMutation';
import { sortBy } from 'lodash';
import { randomUtils } from '../../utils';

export default createGroupMutation(
	'reverse-mutation',
	(groups, [indexes]) => {
		indexes.forEach(i => {
			groups.set(i, groups.get(i).reverse());
		});
	}
);
