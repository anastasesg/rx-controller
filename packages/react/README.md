# @rx-controller/react
This package contains React and React-Native bindings and hooks for [@rx-controller/core](https://www.npmjs.com/package/@rx-controller/core).

## Table of Contents
- [@rx-controller/react](#rx-controllerreact)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Extensibility](#extensibility)
  - [Configure your Project](#configure-your-project)
  - [Usage](#usage)

## Installation

To install the library just run the command
```bash
npm install @rx-controller/core @rx-controller/react
```
or if you are using yarn
```bash
yarn add @rx-controller/core @rx-controller/react
```

## Extensibility

During development it occured to me that I cannot predict every possible usecase, so I decided to add strategies that are to be specified in the provider. When I say strategies, I mean the way the `useController` hook works.

For example, if you are creating a vanilla React project the default strategy specified will suffice. But, if you are developing a React Native project using [react-navigation](https://github.com/react-navigation/react-navigation) the default strategy till not work since it doesn't respect the library's lifecycle methods. In order to use this library with `react-navigation` you need to use the [@rx-controller/react-navigation-plugin](https://www.npmjs.com/package/@rx-controller/react-navigation-plugin).

You can create your own strategies by creating a class that implements the `Strategy` class like this.
```typescript
import { Controller, ClassLike, Emitter, State } from "@rx-controller/core";
import { Strategy, UseControllerOptions, useStore } from "@rx-controller/react";

export class MyStrategy implements Strategy {
  useController<TController extends Controller<any, any>>(
    symbol: ClassLike<TController>,
    options?: UseControllerOptions<TController>
  ): [State<TController>, TController] {
    const {
      // This options specifies wether or not to subcribe to the state
      subscribe = true,
      // This callback will be called when the component mounts
      onMount = (controller: TController) => null,
      // This callback will be called when the component unmounts
      onUnmount = (controller: TController) => null,
      // This callback listens for events emitted by the controller and handles them.
      // The listener must return a callback that removes the listeners it added.
      listener = (emitter: Emitter) => () => null,
      // This callback specifies the condition which must be me in order to update the component
      shouldUpdate = (prev: TState, next: TState) => true,
    } = { ...options };
    ...
    return [state, controller];
  }
}
```

## Configure your Project

To integrate this library to your React or React-Native project you first need to configure it to support decorators and metadata emition. For React I suggest you take a look at [craco](https://www.npmjs.com/package/@craco/craco) or if anyone has a better way I would love to hear it.

For React-Native you need to either create or modify your babel configuration to use the [babel-plugin-transform-typescript-metadata](https://www.npmjs.com/package/babel-plugin-transform-typescript-metadata) plugin. Since they explain its installation and configuration in such length I suggest you take a look at their page.


## Usage

In order to use the hooks provided by this library you need to wrap your application in the provider passing the store and strategy like this

```tsx
// store.ts
import { Store } from "@rx-controller/core";

export const store = new Store(...);

// App.tsx
import { Provider as StoreProvider } from "@rx-controller/react";
import { store } from "store";
...

export default App() {
  ...
  return (
    <StoreProvider store={store}>
      ...
    </StoreProvider>
  );
}
```
Then in every component inside the provider you can use all the hooks this library provides.