import ObservableSlim from 'observable-slim';

const UNDEFINED_PATH = '__GS_UNDEFINED__';

export const GlobalStorage = (() => {
	const stores = {};
	const eventListeners = {};
	let batchUpdater = (calls) => calls();

	function create (storeId, defaultState) {
		const defaultStateType = typeof defaultState;

		if (defaultStateType !== 'object') {
			throw Error(`A store must be an object. You passed in a "${ defaultStateType }" type.`);
		}
		if (stores[storeId]) {
			console.error(`A store with the ID "${ storeId }" already exists. Rewriting over the existing store.`);
		}

		const proxy = ObservableSlim.create(defaultState, true, changes => {
			const latestChanges = _getLatestChangesPerPath(changes);

			_emit(storeId, latestChanges);
		});

		stores[storeId] = {
			proxy,
			defaultState: JSON.parse(JSON.stringify(defaultState))
		};
	}

	function get (storeId) {
		if (!stores[storeId]) {
			console.error(`A store with the ID "${ storeId }" doesn't exist.`);

			return {};
		}

		return stores[storeId].proxy;
	}

	function reset (storeId) {
		if (!stores[storeId]) {
			console.error(`A store with the ID "${ storeId }" doesn't exist, so there is nothing to reset.`);

			return;
		}

		const { proxy, defaultState } = stores[storeId];

		Object.keys(proxy).forEach(key => {
			if (!defaultState[key]) {
				delete proxy[key];

				return;
			}

			proxy[key] = defaultState[key];
		});
	}

	function on ({ storeId, path = UNDEFINED_PATH }, callback) {
		if (!storeId) {
			return console.error(`A store is required to listen on, no storeId was passed.`);
		}

		if (!stores[storeId]) {
			return console.error(`A store with the ID "${ storeId }" doesn't exist.`);
		}

		if (!eventListeners[storeId]) eventListeners[storeId] = {};
		if (!eventListeners[storeId][path]) eventListeners[storeId][path] = [];

		eventListeners[storeId][path].push(callback);
	}

	function off ({ storeId, path = UNDEFINED_PATH }, callback) {
		if (!eventListeners[storeId]) {
			return console.error(`Event listener does not exist to remove for storeId ${storeId}.`);
		}

		const callbacks = eventListeners[storeId][path] || [];
		const callbackIndex = callbacks.findIndex(cb => cb === callback);

		if (callbackIndex === -1) {
			return console.error(`Event listener does not exist to remove for storeId ${storeId} with a path of ${path}.`);
		}

		eventListeners[storeId][path].splice(callbackIndex, 1);

		if (!eventListeners[storeId][path].length) delete eventListeners[storeId][path];
		if (!Object.keys(eventListeners[storeId]).length) delete eventListeners[storeId];
	}

	function setDefaults (options) {
		if (options.batchUpdater) batchUpdater = options.batchUpdater;
	}

	function _emit (storeId, changes) {
		const callbacks = [];

		changes.forEach(({ path }) => {
			Object.keys(eventListeners).forEach(listenerStoreId => {
				const storeData = eventListeners[listenerStoreId];

				Object.keys(storeData).forEach(listenerPath => {
					const match = _getMatch(storeId, path, {
						storeId: listenerStoreId,
						path: listenerPath,
					});

					if (match) callbacks.push(...storeData[listenerPath]);
				})	
			})
		});

		if (!callbacks.length) return;

		batchUpdater(() => {
			callbacks.forEach(callback => callback());
		});
	}

	function _getMatch(storeId, path, eventData) {
		if (storeId !== eventData.storeId) return false;

		if (eventData.path === UNDEFINED_PATH) return true;

		return (
			path === eventData.path ||
			(
				path.startsWith(eventData.path) &&
				path.substr(path.indexOf(eventData.path) + eventData.path.length, 1) === '.'
			)
		);
	}

	function _getLatestChangesPerPath(changes) {
		const paths = {};

		changes.forEach(({ currentPath, newValue }) => {
			paths[currentPath] = newValue;
		});

		return Object.keys(paths).map(path => ({ path, value: paths[path] }));
	}

	return {
		create,
		get,
		reset,
		on,
		off,
		setDefaults
	}
})();

export default GlobalStorage;
