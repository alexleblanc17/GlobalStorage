import react, { useState, useEffect, useRef } from 'react';

import useUpdater from './useUpdater';
import GlobalStorage from './../GlobalStorage';

export const useStore = (storeId, supressEvents = false) => {
	const store = useRef(GlobalStorage.get(storeId)).current;
	const update = useUpdater();
	useEffect(() => {
		if (supressEvents) return;

		const handleStoreUpdate = () => {
			update();
		};

		GlobalStorage.on({ storeId }, handleStoreUpdate);

		return () => {
			GlobalStorage.off({ storeId }, handleStoreUpdate);
		}		
	}, [update, storeId, supressEvents]);

	return store;
}

export default useStore;
