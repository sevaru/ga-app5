import { createGroupMutation } from './common/createGroupMutation';

export default createGroupMutation(
	'copy-paste-mutation',
	(groups, [fromIndexes, toIndexes]) => {
		groups.copy(fromIndexes, toIndexes);
	}
);
