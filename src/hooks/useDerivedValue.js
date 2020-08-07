import { useEffect, useState, useCallback } from 'react';
import GlobalStorage from './../GlobalStorage';
export const useDerivedValue = (_storeIds, getter) => {
	const storeIds = typeof _storeIds === 'string' ? [_storeIds] : _storeIds;
	const getValue = useCallback(() => {
		const stores = storeIds.map(storeId => GlobalStorage.get(storeId));
		
		return getter(...stores);
	}, [storeIds, getter]);
	const [derivedValue, setDerivedValue] = useState(getValue());

	useEffect(() => {
		const handleStoreUpdate = () => {
			const newValue = getValue();

			if (newValue !== derivedValue) {
				setDerivedValue(newValue);
			}
		}

		storeIds.forEach(storeId => {
			GlobalStorage.on({ storeId }, handleStoreUpdate);
		});

		handleStoreUpdate();

		return () => {
			storeIds.forEach(storeId => {
				GlobalStorage.off({ storeId }, handleStoreUpdate);
			});
		}		
	}, [getValue, derivedValue, setDerivedValue]);

	return derivedValue;
}
