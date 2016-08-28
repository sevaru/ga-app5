import { createGroupMutation } from './common/createGroupMutation';

export default createGroupMutation(
	'swap-group-mutation',
	(groups, [fromIndexes, toIndexes]) => {
		groups.swap(fromIndexes, toIndexes);
	},
 	{
		weight: 0.5,
		groupSize: 5,
		count: 2
	}
);
