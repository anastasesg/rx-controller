import React from "react";
import { DefaultStrategy } from "../strategies/default.strategy";
import { ProviderProps } from "../types/provider.props";
import { Context } from "./context";

export function Provider({ store, strategy, children }: ProviderProps) {
  return (
    <Context.Provider
      value={{ store, strategy: strategy ?? new DefaultStrategy() }}>
      {children}
    </Context.Provider>
  );
}
