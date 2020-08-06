import react, { useState, useCallback } from 'react';

export const useUpdater = (storeId, supressEvents = false) => {
	const [,updater] = useState(0);
	const update = useCallback(() => {
		updater(s => s + 1);
	}, [updater]);

	return update;
}

export default useUpdater;
