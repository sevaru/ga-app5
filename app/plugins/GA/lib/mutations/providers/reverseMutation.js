import { createGroupMutation } from './common/createGroupMutation';

export default createGroupMutation(
	'reverse-mutation',
	(groups, [indexes]) => {
		indexes.forEach(i => {
			groups.set(i, groups.get(i).reverse());
		});
	}
);
