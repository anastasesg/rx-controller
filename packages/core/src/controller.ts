import { BehaviorSubject, Subscription } from "rxjs";
import { EventEmitter } from "eventemitter3";
import { ActionEvent, EventHandler } from "./types";

/**
 * Abstract class to be implemented when creating a new controller. A controller
 * should hold the state of a specific component and define the methods that control it.
 *
 * When implementing from this class it is important to always call the `super()`
 * function inside the constructor giving it the initial state of the controller.
 *
 * While a controller can be used in a standalone manner, it is best if used from
 * a store. A store is a single source of truth from which we can get each controller
 * slice of the state. @see Store
 *
 * @example
 * // test.controller.ts
 * type TestState = {
 *    x: number;
 *    y: number;
 *    product?: number;
 * }
 *
 * type TestEvent = {
 *    calculateProduct: void
 * }
 *
 * class TestController extends Controller<TestState, TestEvent> {
 *    constructor() {
 *      super({ x: 10, y: 20 });
 *      this.on("calculateProduct", (state) => {
 *        this.emit({ ...state, product: state.x * state.y })
 *      });
 *    }
 * }
 *
 * // another.file.ts
 * const controller = new TestController();
 *
 * controller.subscribe(console.log) // First time prints { x: 10, y: 20, product: undefined }
 * controller.add("calculateProduct") // When the action completes the log should print { x: 10, y: 20, product: 200 }
 *
 * @param TState The state of the controller. Can be a primitive type string, number, boolean, etc. or any user created type.
 * @param TEvent The events that the controller can listen to. Should be a record like object where the key specifies the event name and its value specifies the argument type of the event
 */
export abstract class Controller<TState, TEvent extends ActionEvent> {
  public emitter: EventEmitter;
  public subject: BehaviorSubject<TState>;

  constructor(initialState: TState) {
    this.emitter = new EventEmitter();
    this.subject = new BehaviorSubject(initialState);
  }

  /**
   * Adds a listener for a specified event. While it's best practice to use class methods for the
   * handler, it is important to bind `this` to them, otherwise the method will run in a global
   * scope.
   *
   * @example
   * // test.controller.ts
   * type TestState = {
   *    x: number;
   *    y: number;
   *    product?: number;
   * }
   *
   * type TestEvent = {
   *    calculateProduct: void
   *    calculateProductAlt: void
   * }
   *
   * class TestController extends Controller<TestState, TestEvent> {
   *    constructor() {
   *      super({ x: 10, y: 20 });
   *      this.on("calculateProduct", (state) => {
   *        this.emit({ ...state, product: state.x * state.y })
   *      }); // valid
   *      this.on("calculateProductAlt", this.calculateProductAlt.bind(this)); // also valid
   *    }
   *
   *    private calculateProductAlt(state: TestState) {
   *       this.emit({ ...state, product: state.x * state.y });
   *    }
   * }
   *
   * @param event An event name of the available ones specified from `TEvent`.
   * @param handler The function that will handle the event.
   */
  protected on<Key extends keyof TEvent>(
    event: Key,
    handler: EventHandler<TState, TEvent[Key]>
  ) {
    this.emitter.on(
      String(event),
      async (event) => await handler(this.subject.value, event)
    );
  }

  /**
   * A wrapper for the `rxjs`s subscribe function to reduce the use of the `.` (dot) operator.
   *
   * @param observer A function that observes the controllers subject.
   * @returns A subscription to the controller subject.
   */
  public subscribe(observer: (value: TState) => void): Subscription {
    return this.subject.subscribe(observer);
  }

  /**
   * Dispatches a controller event that will be listened on the `on` function.
   *
   * @param event An event name of the available ones specified from `TEvent`.
   * @param args The args of the event, if specified.
   */
  public add<Key extends keyof TEvent>(event: Key, args?: TEvent[Key]) {
    this.emitter.emit(String(event), args);
  }

  /**
   * Emits the next value of the state.
   * @param state The next state
   */
  protected emit(state: TState) {
    this.subject.next(state);
  }
}
