import { ClassLike, Controller, State } from "@rx-controller/core";
import { isEqual } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "../hooks/use_store.hook";
import { UseControllerOptions } from "../types/use_controller.options";
import { Strategy } from "./strategy";

export class DefaultStrategy implements Strategy {
  useController<TController extends Controller<any, any>>(
    symbol: ClassLike<TController>,
    options?: UseControllerOptions<TController> | undefined
  ): [State<TController>, TController] {
    const {
      subscribe = true,
      onMount = () => null,
      onUnmount = () => null,
      shouldUpdate = (prev: State<TController>, next: State<TController>) =>
        !isEqual(prev, next),
      listener = () => () => null,
    } = { ...options };

    const store = useStore();

    const controller = useMemo(
      () => store.resolve(symbol) as TController,
      [symbol]
    );
    const [state, setState] = useState<State<TController>>(
      controller.subject.value
    );

    const updateState = useCallback((next: State<TController>) => {
      if (shouldUpdate(state, next)) {
        setState(next);
      }
    }, []);

    useEffect(() => {
      if (subscribe) {
        const subscription = store.getSlice(symbol).subscribe(updateState);
        const unsubscribe = listener(controller.emitter);
        onMount(controller);
        return () => {
          subscription.unsubscribe();
          unsubscribe();
          onUnmount(controller);
        };
      }
    }, []);

    return [state, controller];
  }
}
