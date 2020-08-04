import ObservableSlim from 'observable-slim';

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
			const latestChanges = getLatestChangesPerPath(changes);

			_emit(storeId, latestChanges);
		});

		stores[storeId] = proxy;
	}

	function get (storeId) {
		if (!stores[storeId]) {
			console.error(`A store with the ID "${ storeId }" doesn't exist.`);

			return {};
		}

		return stores[storeId];
	}

	function on ({ storeId, path }, callback) {
		if (!storeId) {
			return console.error(`A store is required to listen on, no storeId was passed.`);
		}

		if (!stores[storeId]) {
			return console.error(`A store with the ID "${ storeId }" doesn't exist.`);
		}

		if (!eventListeners[storeId]) eventListeners[storeId] = {};
		if (!eventListeners[storeId][path]) eventListeners[storeId][path] = [];

		eventListeners[storeId][path] = callback;
	}

	function off ({ storeId, path }, callback) {
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
		console.log('UPDATING', changes)

		const callbacks = [];

		changes.forEach(({ path }) => {
			Object.keys(eventListeners).forEach(listenerStoreId => {
				const storeData = eventListeners[listenerStoreId];

				Object.keys(storeData).forEach(listenerPath => {
					const match = _getMatch(storeId, path, {
						storeId: listenerStoreId,
						path: listenerPath,
					});

					if (match) callbacks.push(storeData[listenerPath]);
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

		if (!eventData.path) return true;

		return (
			path === eventData.path ||
			(
				path.startsWith(eventData.path) &&
				path.substr(path.indexOf(eventData.path) + eventData.path.length, 1) === '.'
			)
		);
	}

	return {
		create,
		get,
		on,
		off,
		setDefaults
	}
})();

export default GlobalStorage;
