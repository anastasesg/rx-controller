import {ClassLike, Controller} from "@rx-controller/core";
import {UseControllerOptions, UseControllerResponse} from "../types";

export interface Strategy {
  useController<TController extends Controller<any, any>>(
    symbol: ClassLike<TController>,
    options?: UseControllerOptions<TController>
  ): UseControllerResponse<TController>;
}
