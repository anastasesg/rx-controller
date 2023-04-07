import {Store} from "@rx-controller/core";
import {useProvider} from "./use_provider";

export function useStore(): Store<any, any> {
	const {store} = useProvider();
	return store;
}
