import {Store} from "@rx-controller/core";
import {Strategy} from "../strategies";

export type Provider = {
	store: Store<any, any>;
	strategy: Strategy;
};
