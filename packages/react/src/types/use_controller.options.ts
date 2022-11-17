import { Controller, Emitter, State } from "@rx-controller/core";

export type UseControllerOptions<TController extends Controller<any, any>> = {
  subscribe?: boolean;
  onMount?: (controller: TController) => void;
  onUnmount?: (controller: TController) => void;
  listener?: (emitter: Emitter) => () => void;
  shouldUpdate?: (
    prev: State<TController>,
    next: State<TController>
  ) => boolean;
};
