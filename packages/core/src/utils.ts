import { Observable, combineLatest } from "rxjs";
import { DependencyContainer } from "tsyringe";
import { Controller } from "./controller";
import { ClassLike, NestedObject } from "./types";

function isClassLike<T>(obj: any): obj is ClassLike<T> {
  try {
    new obj();
  } catch (err) {
    return false;
  }
  return true;
}

function isClassLikeController(
  obj: any
): obj is ClassLike<Controller<any, any>> {
  return isClassLike(obj) && new obj() instanceof Controller;
}

//prettier-ignore
export function flattenControllers(
  controllers: NestedObject<ClassLike<Controller<any, any>>>,
  container: DependencyContainer,
  parentKey?: string
): Record<string, Controller<any, any>> {
  let result: Record<string, Controller<any, any>> = {};
  Object.keys(controllers).forEach((k) => {
    const value = controllers[k];
    const key = parentKey ? parentKey + "." + k : k;

    if (isClassLikeController(value)) result[key] = container.resolve(value);
    else result = { ...result, ...flattenControllers(value, container, key) };
  });
  return result;
}

export function createState(controllers: Record<string, Controller<any, any>>) {
  return combineLatest(
    Object.keys(controllers).reduce((state, key) => {
      state[key] = controllers[key].subject;
      return state;
    }, {} as Record<string, Observable<any>>)
  );
}

export function unflattenState<TState>(state: Record<string, any>): TState {
  const result = {} as TState;

  //prettier-ignore
  function setValue(object: TState, path: string, value: Controller<any, any>) {
    const way = path.split(".");
    const last = way.pop()!;

    way.reduce((o: any, k: any, i: any, kk: any) => {
        return (o[k] = o[k] || (isFinite(i + 1 in kk ? kk[i + 1] : last) ? [] : {}));
    }, object)[last] = value;
  }

  Object.keys(state).forEach((key) => setValue(result, key, state[key]));
  return result;
}
