import react, { useState, useEffect, useRef } from 'react';
import get from 'lodash.get';

import useUpdater from './useUpdater';
import GlobalStorage from './../GlobalStorage';

export const useValue = (storeId, unformatedPath) => {
	const path = typeof unformatedPath === 'number' ? unformatedPath.toString() : unformatedPath;
	const store = useRef(GlobalStorage.get(storeId)).current;
	const update = useUpdater();

	useEffect(() => {
		const handleStoreUpdate = update;

		GlobalStorage.on({ storeId, path }, handleStoreUpdate);

		return () => {
			GlobalStorage.off({ storeId, path }, handleStoreUpdate);
		}		
	}, [update, storeId, path]);

	return get(store, path);
}
