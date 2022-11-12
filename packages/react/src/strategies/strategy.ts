import { ClassLike, Controller, State } from "@rx-controller/core";
import { UseControllerOptions } from "../types/use_controller.options";

export interface Strategy {
  useController<TController extends Controller<any, any>>(
    symbol: ClassLike<TController>,
    options?: UseControllerOptions<TController>
  ): [State<TController>, TController];
}
