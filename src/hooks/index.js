import get from 'lodash.get';
import GlobalStorage from './../GlobalStorage';

export const useStore = (storeId, supressEvents = false) => {
	const store = useRef(GlobalStorage.get(storeId)).current;
	const [,updater] = useState(0);
	useEffect(() => {
		if (supressEvents) return;

		const handleStoreUpdate = () => {
			updater(s => s + 1);
		};

		GlobalStorage.on({ storeId }, handleStoreUpdate);

		return () => {
			GlobalStorage.off({ storeId }, handleStoreUpdate);
		}		
	}, [updater, storeId, supressEvents]);

	return store;
}

export const useValue = (storeId, unformatedPath) => {
	const path = typeof unformatedPath === 'number' ? unformatedPath.toString() : unformatedPath;
	const store = useRef(GlobalStorage.get(storeId)).current;
	const [,updater] = useState(0);

	useEffect(() => {
		const handleStoreUpdate = () => {
			updater(s => s + 1);
		};

		GlobalStorage.on({ storeId, path }, handleStoreUpdate);

		return () => {
			GlobalStorage.off({ storeId, path }, handleStoreUpdate);
		}		
	}, [updater, storeId, path]);

	return get(store, path);
}
