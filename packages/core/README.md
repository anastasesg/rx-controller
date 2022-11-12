# @rx-controller/core

- [@rx-controller/core](#rx-controllercore)
  - [Installation](#installation)
  - [Documentation](#documentation)
    - [Controller](#controller)
      - [Methods](#methods)
      - [subscribe](#subscribe)
      - [add](#add)
      - [Usage](#usage)
    - [Store](#store)
      - [Methods](#methods-1)
      - [getSlice](#getslice)
      - [resolve](#resolve)
      - [Usage](#usage-1)

## Installation

As of now the library depends on [tsyringe](https://github.com/microsoft/tsyringe#readme), a great dependency injection library created by Microsoft. So in order to use this library `tsyringe` must be installed with it. Future releases will be external library independant but for now `tsyringe` *is a must*. Now the installation is quite simple, just type
```bash
npm install @rx-controller/core tsyringe
```
or if you are using yarn
```bash
yarn add @rx-controller/core tsyringe
```

** Be sure to first check `tsyringe`s installation page to configure your project to support it.

## Documentation

The main objective while developing this library was to keep it stupid simple. This is why it consists of just two main classes: the controller which controlls a component and the store which holds the controllers, but more on that later.

As mentioned earlier this library is made to work in every and all kinds of project, but the motivation behind its creation was to improve the state management of frontend applications. With this in mind some features of it will make more sense if you see them under this scope.

### Controller

Abstract class to be implemented when creating a new controller. A controller should hold the state of a specific component and define the methods that control it. When implementing from this class it is important to always call the `super()` function inside the constructor giving it the initial state of the controller.

Every controller takes two generic arguments:
- `TState` which defines state of the controller. The state can be a primitive type string, number, boolean, etc. or any custom type.
-  `TEvent` which holds the events that the controller can listen to. Must be a record like object where the key specifies the event name and its value specifies the argument type of the event

While a controller can be used in a standalone manner, its best if used from a [store](#store). A store is a single source of truth from which we can get each controller slice of the state.

#### Methods
#### subscribe
A wrapper for the `rxjs`s subscribe function to reduce the use of the `.` (dot) operator.

| Method | Type |
| ---------- | ---------- |
| `subscribe` | `(observer: (value: TState) => void) => Subscription` |

Parameters:

* `observer`: A function that observes the controllers subject.

#### add
Dispatches a controller event that will be listened on the `on` function.

| Method | Type |
| ---------- | ---------- |
| `add` | `<Key extends keyof TEvent>(event: Key, args?: TEvent[Key]) => void` |

Parameters:

* `event`: An event name of the available ones specified from `TEvent`.
* `args`: The args of the event, if specified.

#### Usage
```typescript
// test.controller.ts
type TestState = {
  x: number;
  y: number;
  product?: number;
}

type TestEvent = {
  calculateProduct: void
}

class TestController extends Controller<TestState, TestEvent> {
  constructor() {
    super({ x: 10, y: 20 });
    this.on("calculateProduct", this.calculateProduct.bind(this));
  }

  private calculateProduct(state: TestState) {
    this.emit({ ...state, product: state.x * state.y })
  }
}

// another.file.ts
import { TestController } from "test.controller";
const controller = new TestController();

controller.subscribe(console.log) // First time prints { x: 10, y: 20, product: undefined }
controller.add("calculateProduct") // When the action completes the log should print { x: 10, y: 20, product: 200 }
```
### Store
A store consists of all the controllers in an application. Its purpose is to be a single source of truth, meaning it holds the collective state of the application and all its controllers.

In order to avoid having to keep track of every controller and its dependencies, the store utilizes the dependency injection pattern. Since this depends on the [tsyringe](https://github.com/microsoft/tsyringe#readme) library (maintained by Microsoft) you need to pass your container as a parameter in the stores contructor to ensure every dependency is registered to the same container.

Only one instance of the store should exist in the lifecycle of an application.

#### Methods

#### getSlice
It gets the slice of the specified controller and returns it as an observable.

| Method | Type |
| ---------- | ---------- |
| `getSlice` | `<TController extends Controller<any, any>>(symbol: constructor<T>) => Observable<State<TController>>` |

Parameters:

* `symbol`: The symbol of the controller whose slice you want to get.

#### resolve
It gets the instance of the specified controller as long as it is registered in the store.

| Method | Type |
| ---------- | ---------- |
| `resolve` | `<TController extends Controller<any, any>>(symbol: constructor<T>) => TController` |

Parameters:

* `symbol`: The symbol of the controller you want to get.

#### Usage
```typescript
// foo.controller.ts
...
export class FooController extends Controller<FooState, FooEvents> {
  ...
}

// bar.controller.ts
...
export class BarController extends Controller<BarState, BarEvents> {
  ...
}

// store.ts
import { container } from "tsyringe";
import { Store } from "@rx-controller/core";
import { FooController } from "foo.controller";
import { BarController } from "bar.controller";

export const store = new Store({
  foo: FooController,
  bar: BarController
}, container);

// another.file.ts
import { store } from "store.ts";
import { FooController } from "foo.controller";

const controller = store.resolve(FooController);
...

```