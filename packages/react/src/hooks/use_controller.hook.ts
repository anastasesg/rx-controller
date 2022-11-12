import { ClassLike, Controller, State } from "@rx-controller/core";
import { UseControllerOptions } from "../types/use_controller.options";
import { useProvider } from "./use_provider";

export function useController<TController extends Controller<any, any>>(
  symbol: ClassLike<TController>,
  options?: UseControllerOptions<TController>
): [State<TController>, TController] {
  const {
    strategy: { useController },
  } = useProvider();
  return useController(symbol, options);
}
