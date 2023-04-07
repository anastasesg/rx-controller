import {Store} from "@rx-controller/core";
import {Strategy} from "../strategies";

export type ProviderProps = {
	store: Store<any, any>;
	strategy?: Strategy;
	children: JSX.Element;
};
