# @rx-controller/react-navigation-plugin
This plugin integrates [react-navigation](https://github.com/react-navigation/react-navigation) lifecycle events to the [@rx-controller/react](https://www.npmjs.com/package/@rx-controller/react) library.

## Usage
```tsx
// store.ts
import { Store } from "@rx-controller/core";

export const store = new Store(...);

// App.tsx
import { Provider as StoreProvider } from "@rx-controller/react";
import { ReactNavigationStrategy } from "@rx-controller/react-navigation-plugin";
import { store } from "store";
...

export default App() {
  ...
  return (
    <StoreProvider store={store} strategy={new ReactNavigationStrategy()}>
      ...
    </StoreProvider>
  );
}
```