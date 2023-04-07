import { Observable, map } from "rxjs";
import { DependencyContainer } from "tsyringe";
import { Controller } from "./controller";
import { ClassLike, NestedObject, State } from "./types";
import { createState, flattenControllers, unflattenState } from "./utils";

/**
 * A store consists of all the controllers in an application. Its purpose is to be
 * a single source of truth, meaning it holds the collective state of the application
 * and all its controllers.
 *
 * In order to avoid having to keep track of every controller and its dependencies,
 * the store utilizes the dependency injection pattern. Since this depends on the
 * {@link https://github.com/microsoft/tsyringe tsyringe} library (maintained by Microsoft) you need to pass your container
 * as a parameter in the stores contructor to ensure every dependency is registered
 * to the same container.
 *
 * Only one instance of the store should exist in the lifecycle of an application.
 *
 * @param TControllers A record of controllers whose keys will be used to slice the overall state.
 * @param TState The overall state of the store.
 */
export class Store<
  TControllers extends NestedObject<ClassLike<Controller<any, any>>>,
  TState extends State<TControllers>
> {
  private readonly _controllers: Record<string, Controller<any, any>>;
  private readonly _state: Observable<Record<string, any>>;

  //prettier-ignore
  constructor(controllers: TControllers, container: DependencyContainer) {
    this._controllers = flattenControllers(controllers, container);
    this._state = createState(this._controllers);
  }

  public get state(): Observable<TState> {
    return this._state.pipe(map(unflattenState<TState>));
  }

  //prettier-ignore
  /**
   * It gets the slice of the specified controller and returns it as an observable.
   *
   * @param symbol The symbol of the controller whose slice you want to get.
   * @returns An `Observable` of that controllers state.
   * @throws Error when the controllers slice you want to get is not registered in the store.
   */
  public resolveSlice<TController extends Controller<any, any>>(symbol: ClassLike<TController>): Observable<State<TController>> {
    const controllerKey = Object.keys(this._controllers).find((k) => this._controllers[k] instanceof symbol);

    if (!controllerKey)
      throw new Error(`Could not find a controller for the provided type ${symbol.prototype.constructor.name}. Did you forget to register it?`);

    return this._state.pipe(map((s) => s[controllerKey])) as Observable<State<TController>>;
  }

  //prettier-ignore
  /**
   * It gets the instance of the specified controller as long as it is registered in the store.
   *
   * @param symbol The symbol of the controller you want to get.
   * @returns The controller if it is registered in the store.
   * @throws Error when the controller you want to get is not registered in the store.
   */
  public resolveController<TController extends Controller<any, any>>(symbol: ClassLike<TController>): TController {
    const controllerKey = Object.keys(this._controllers).find((k) => this._controllers[k] instanceof symbol);

    if (!controllerKey)
      throw new Error(`Could not find a controller for the provided type ${symbol.prototype.constructor.name}. Did you forget to register it?`);

    return this._controllers[controllerKey] as TController;
  }
}
