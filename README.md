# GlobalStorage (WIP)

#### Preface
This is a complete WIP, but basically I was tired with all of the state managment solutions out there, they are either over engineered, not performant enough, or too disconected from the code. It feels like with most solutions out there you are fighting with the state management to make it work with the code or you run into performance issues eventually. `GlobalStorage` sets out to solve this.

## What is `GlobalStorage`?
`GlobalStorage` is a state management solution that is intended to be used with any framework, or no framework at all. Currently it is focused towards modern React that uses Hooks, but if you'd like to open a PR so help expand support, that is more than welcome :)

### Goals
- Ability to create a store with a default state, much like Redux.
- Ability to use the data from the whole store or a subset of data from the stor AND only update the UI when that data changes
- Ability to use it in with any framework and supports multiple frameworks at the same time.
- Use the data like you would any JS data, no getters and setters.
- No over engineering, it should be as close to working with vanilla JS as possible.

# Library

## Setting up a store
To set up a store all you need to do is give it an ID and pass it an object or array:

### create(storeId: string, defaultData: object | array): void
```
  import GlobalStorage from 'GlobalStorage';
  
  GlobalStorage.create('user', {
    firstName: 'Alex',
    lastName: 'LeBlanc',
    email: 'alex@alexleblanc.com',
  });
  
  GlobalStorage.create('todos', ['laundry', 'cook dinner', 'chill']);
```

## Using with React

### useStore(storeId: string, suppressEvents: boolean = false): object | array

### useValue(storeId: string, path: string | number): any


