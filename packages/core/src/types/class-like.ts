import { constructor } from "tsyringe/dist/typings/types";

export type ClassLike<T> = constructor<T>;
