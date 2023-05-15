import {ClassLike, Controller, State} from "@rx-controller/core";
import {isEqual} from "lodash";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useStore} from "../hooks";
import {UseControllerOptions, UseControllerResponse} from "../types";
import {Strategy} from "./strategy";

export class DefaultStrategy implements Strategy {
	useController<TController extends Controller<any, any>>(
		symbol: ClassLike<TController>,
		options?: UseControllerOptions<TController> | undefined
	): UseControllerResponse<TController> {
		const {
			subscribe = true,
			onMount = () => null,
			onUnmount = () => null,
			shouldUpdate = (prev: State<TController>, next: State<TController>) => !isEqual(prev, next),
			listener = () => () => null,
			deps= []
		} = {...options};

		const store = useStore();

		const controller = useMemo(() => store.resolveController<TController>(symbol), [symbol]);
		const [state, setState] = useState<State<TController>>(controller.subject.value);

		const updateState = useCallback((next: State<TController>) => {
			if (shouldUpdate(state, next)) {
				setState(next);
			}
		}, []);

		useEffect(() => {
			if (subscribe) {
				const subscription = store.resolveSlice<TController>(symbol).subscribe(updateState);
				const unsubscribe = listener(controller.emitter);
				onMount(controller);
				return () => {
					subscription.unsubscribe();
					unsubscribe();
					onUnmount(controller);
				};
			}
		}, deps);

		return [state, controller];
	}
}
