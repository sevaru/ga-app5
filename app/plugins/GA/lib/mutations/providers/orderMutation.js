import { createGroupMutation } from './common/createGroupMutation';
import { sortBy } from 'lodash';
import { randomUtils } from '../../utils';

export default createGroupMutation(
	'order-mutation',
	(groups, [indexes]) => {
		indexes.forEach(i => {
			const chunk = groups.get(i);
			const sorted = sortBy(chunk);
			groups.set(i, randomUtils.headsOrTails() ? sorted : sorted.reverse());
		});
	}
);
