import { Store } from "@rx-controller/core";
import { Strategy } from "../strategies/strategy";

export type Provider = {
  store: Store<any, any>;
  strategy: Strategy;
};
