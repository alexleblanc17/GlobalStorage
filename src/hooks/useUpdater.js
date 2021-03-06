import { useState, useCallback } from 'react';

export const useUpdater = () => {
	const [,updater] = useState(0);
	const update = useCallback(() => {
		updater(s => s + 1);
	}, [updater]);

	return update;
}

export default useUpdater;
