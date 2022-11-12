export type ActionEvent = Record<string, any>;

export type EventHandler<TState, TEventData> = (
  state: TState,
  args: TEventData
) => void | Promise<void>;
