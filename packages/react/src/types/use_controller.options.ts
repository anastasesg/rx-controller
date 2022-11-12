import { Controller, State } from "@rx-controller/core";

export type UseControllerOptions<TController extends Controller<any, any>> = {
  subscribe?: boolean;
  onMount?: (controller: TController) => void;
  onUnmount?: (controller: TController) => void;
  listener?: (state: State<TController>) => void;
  shouldUpdate?: (
    prev: State<TController>,
    next: State<TController>
  ) => boolean;
};
