


# GlobalStorage

#### Preface
I was tired with all of the state managment solutions out there, they are either over engineered, not performant enough, or too disconected from the code. It feels like with most solutions out there you are fighting with the state management to make it work with the code or you run into performance issues eventually. `GlobalStorage` sets out to solve this.

## What is `GlobalStorage`?
`GlobalStorage` is a state management solution that is intended to be used with any framework, or no framework at all. Currently it is focused towards modern React that uses Hooks, but if you'd like to open a PR so help expand support, that is more than welcome :)

### Goals
- Ability to create a store with a default state, much like Redux.
- Ability to use the data from the whole store or a subset of data from the stor AND only update the UI when that data changes
- Ability to use it in with any framework and supports multiple frameworks at the same time.
- Use the data like you would any JS data, no getters and setters.
- No over engineering, it should be as close to working with vanilla JS as possible.

## Using `GlobalStorage`
To install run either `npm i global-storage-system` if you are using NPM or `yarn add global-storage-system` if you are using yarn.

***Example app:*** [MVC ToDo](https://codesandbox.io/s/react-hooks-global-storage-1p2nk?file=/src/stores/index.js)

# Library

## Setting up a store
To set up a store all you need to do is give it an ID and pass it an object or array:

### create(storeId: string, defaultData: object | array): void
Used to create a store. The `storeId` passed in is then used to identify the store when used throughout the application.
#### Example:
```
  import GlobalStorage from 'global-storage-system';
  
  GlobalStorage.create('user', {
    firstName: 'Alex',
    lastName: 'LeBlanc',
    email: 'alex@alexleblanc.com',
  });
  
  GlobalStorage.create('todos', ['laundry', 'cook dinner', 'chill']);
``` 
### get(storeId: string): object | array
Used to get a store that has previously been created.
#### Example:
```
import GlobalStorage from 'global-storage-system';
  
const userStore = GlobalStorage.get('user');
userStore.firstName = 'Jon';
userStore.lastName = 'Smith';
``` 
### reset(storeId: string): void
Used to reset a store to its default state.
#### Example:
```
import GlobalStorage from 'global-storage-system';
  
GlobalStorage.reset('user');
``` 

### setDefaults(options: Options): void
Used to set default options.
|Option|Values|
|--|--|
|batchUpdater|***function***: this is useful for react where we want updates to be batched into one update.|

#### Example:
```
import GlobalStorage from 'global-storage-system';
import { unstable_batchedUpdates } from 'react-dom';
  
GlobalStorage.setDefaults({
	batchUpdater: unstable_batchedUpdates
});
``` 

## Using with React
If you are in a React application, you should access the store and its values by using these hooks:

### useStore(storeId: string, suppressEvents: boolean = false): object | array
Used to get a store that has been created. If you are using the store to only set and read values, then passing `true` to `suppressEvents` will improve the performance, by suppressing the events it will tell the React component that it doesn't need to re-render when the store changes.
#### Example:
```
import { useState } from 'react';
import { useStore } from 'global-storage-system';
  
const TodoList = ({ index }) => {
	const [todo, setTodo] = useState('');
	const todos = useStore('todos');
	const list = todos.map((item, index) => (
		<TodoItem index={index} />
	));
	
	return (
		<input onChange={e => setTodo(e.target.value) />
		<ul>{ list }</ul>
		<AddTodoButton todo={todo} />
	);
}

const AddTodoButton = ({ todo }) => {
	const todos = useStore('todos');
	const handleOnClick = () => {
		todos.push(todo)
	}
	
	return (
		<button onClick={handleOnClick}>Add todo</button>
	)
}
``` 
### useValue(storeId: string, path: string | number): any
Used to get a value from a store. This is useful for components that only deal with data from parts of the store and not the whole store itself. It accepts a path to any array or object. The path uses normal dot notation to find the value needed. When the value changes the React component will update as well.
#### Example:
```
import { useValue } from 'global-storage-system';
  
const TodoItem = ({ index }) => {
	const item = useValue('todos', index);
	
	return (
		<li>item</li>
	);
}
``` 
### useDerivedValue(storeIds: array | string, getter: function): any
Used to generate a value from multiple fields from the same store or multiple stores. The getter function is run each time the passed in stores updates and updates the value if it has changed.
#### Example:
```
import { useDerivedValue } from 'global-storage-system';
  
const useUserTodos = () => {
	const userTodos = useDerivedValue(['todos', 'user'], (todos, user) => {
		return todos.filter(todo => todo.owner === user.id
	});
	
	return userTodos;
}
``` 
