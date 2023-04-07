import { Controller } from "./controller";

export type ClassLike<T> = { new (...args: any[]): T };

export type ActionEvent = Record<string, any>;

export type EventHandler<TState, TEventData> = (state: TState, args: TEventData) => void | Promise<void>;

export type NestedObject<T> = {
	[key: string]: T | NestedObject<T>;
};

export type State<T> = T extends NestedObject<infer U>
	? U extends ClassLike<Controller<any, any>>
		? {
			[key in keyof T]: State<T[key]>;
		}
		: never
	: T extends Controller<infer S, any>
		? S
		: T extends ClassLike<Controller<infer S, any>>
			? S
			: never;
