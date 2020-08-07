import { useEffect, useState } from 'react';
import GlobalStorage from './../GlobalStorage';
export const useDerivedValue = (_storeIds, defaultValue, getter) => {
	const storeIds = typeof _storeIds === 'string' ? [_storeIds] : _storeIds;
	const [derivedValue, setDerivedValue] = useState(defaultValue);

	useEffect(() => {
		const handleStoreUpdate = () => {
			const stores = storeIds.map(storeId => GlobalStorage.get(storeId));
			const newValue = getter(...stores);

			if (newValue !== derivedValue) {
				setDerivedValue(newValue);
			}
		}

		storeIds.forEach(storeId => {
			GlobalStorage.on({ storeId }, handleStoreUpdate);
		});

		return () => {
			storeIds.forEach(storeId => {
				GlobalStorage.off({ storeId }, handleStoreUpdate);
			});
		}		
	}, [storeIds, getter, derivedValue, setDerivedValue]);

	return derivedValue;
}
