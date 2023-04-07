import {Controller, State} from "@rx-controller/core";
import EventEmitter from "eventemitter3";

export type UseControllerOptions<TController extends Controller<any, any>> = {
	subscribe?: boolean;
	onMount?: (controller: TController) => void;
	onUnmount?: (controller: TController) => void;
	listener?: (emitter: EventEmitter) => () => void;
	shouldUpdate?: (prev: State<TController>, next: State<TController>) => boolean;
};

export type UseControllerResponse<TController extends Controller<any, any>> = [State<TController>, TController];
