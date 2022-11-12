import { Controller } from "../controller";
import { ClassLike } from "./class-like";
import { Controllers } from "./controllers";

export type State<T> = T extends Controllers
  ? {
      [x in keyof T]: T[x] extends ClassLike<infer U>
        ? U extends Controller<any, any>
          ? State<U>
          : never
        : never;
    }
  : T extends Controller<infer U, any>
  ? U
  : never;
