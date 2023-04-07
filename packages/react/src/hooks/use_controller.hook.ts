import {ClassLike, Controller} from "@rx-controller/core";
import {UseControllerOptions, UseControllerResponse} from "../types";
import {useProvider} from "./use_provider";

export function useController<TController extends Controller<any, any>>(
	symbol: ClassLike<TController>,
	options?: UseControllerOptions<TController>
): UseControllerResponse<TController> {
	const {
		strategy: {useController},
	} = useProvider();
	return useController(symbol, options);
}
