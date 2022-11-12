import { useFocusEffect } from "@react-navigation/native";
import { Controller, ClassLike, State } from "@rx-controller/core";
import { Strategy, UseControllerOptions, useStore } from "@rx-controller/react";
import { useMemo, useState, useCallback } from "react";

export class ReactNavigationStrategy implements Strategy {
  useController<TController extends Controller<any, any>>(
    symbol: ClassLike<TController>,
    options?: UseControllerOptions<TController>
  ): [State<TController>, TController] {
    const {
      subscribe = true,
      onMount = () => null,
      onUnmount = () => null,
      listener = () => null,
      shouldUpdate = () => true,
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
        listener(next);
      }
    }, []);

    useFocusEffect(
      useCallback(() => {
        if (subscribe) {
          const subscription = store
            .getSlice(symbol)
            .subscribe((next) => updateState(next));
          onMount(controller);
          return () => {
            onUnmount(controller);
            subscription.unsubscribe();
          };
        }
      }, [])
    );

    return [state, controller];
  }
}
