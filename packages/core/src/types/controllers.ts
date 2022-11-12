import { Controller } from "../controller";
import { ClassLike } from "./class-like";

export type Controllers = Record<string, ClassLike<Controller<any, any>>>;
