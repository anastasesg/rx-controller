import { combineLatest, map, Observable } from "rxjs";
import { DependencyContainer } from "tsyringe";
import { Controller } from "./controller";
import { ClassLike } from "./types/class-like";
import { Controllers } from "./types/controllers";
import { State } from "./types/state";

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
  TControllers extends Controllers,
  TState extends State<TControllers>
> {
  private readonly _controllers: Record<
    keyof TControllers,
    Controller<any, any>
  >;
  public readonly state: Observable<TState>;

  constructor(controllers: TControllers, container: DependencyContainer) {
    const keys = Reflect.ownKeys(controllers) as (keyof typeof controllers)[];

    this._controllers = keys.reduce((cont, key) => {
      const controller = container.resolve(controllers[key]);
      Object.freeze(controller.emitter);
      cont[key] = controller;
      return cont;
    }, {} as Record<keyof TControllers, Controller<any, any>>);

    this.state = combineLatest(
      keys.reduce((state, key) => {
        const controller = this._controllers[key];

        if (!controller)
          throw new Error(
            `Could not resolve controller ${controllers[key].prototype.constructor.name}`
          );
        state[key] = controller.subject;
        return state;
      }, {} as Record<keyof typeof controllers, Observable<any>>)
    ) as Observable<TState>;
  }

  /**
   * It gets the slice of the specified controller and returns it as an observable.
   *
   * @param symbol The symbol of the controller whose slice you want to get.
   * @returns An `Observable` of that controllers state.
   * @throws Error when the controllers slice you want to get is not registered in the store.
   */
  public getSlice<TController extends Controller<any, any>>(
    symbol: ClassLike<TController>
  ): Observable<State<TController>> {
    const controllerKey = (
      Reflect.ownKeys(this._controllers) as (keyof typeof this._controllers)[]
    ).find((k) => this._controllers[k] instanceof symbol);

    if (!controllerKey)
      throw new Error(
        `Could not find a controller for the provided type ${symbol.prototype.constructor.name}. Did you forget to register it?`
      );

    return this.state.pipe(
      map((s: TState) => s[controllerKey as keyof TState])
    ) as Observable<State<TController>>;
  }

  /**
   * It gets the instance of the specified controller as long as it is registered in the store.
   *
   * @param symbol The symbol of the controller you want to get.
   * @returns The controller if it is registered in the store.
   * @throws Error when the controller you want to get is not registered in the store.
   */
  public resolve<TController extends Controller<any, any>>(
    symbol: ClassLike<TController>
  ): TController {
    const controllerKey = (
      Reflect.ownKeys(this._controllers) as (keyof typeof this._controllers)[]
    ).find((k) => this._controllers[k] instanceof symbol);

    if (!controllerKey)
      throw new Error(
        `Could not find a controller for the provided type ${symbol.prototype.constructor.name}. Did you forget to register it?`
      );

    return this._controllers[controllerKey] as TController;
  }
}
