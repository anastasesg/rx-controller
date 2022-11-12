import React from "react";
import { Provider } from "../types/provider.type";

export const Context = React.createContext<Provider | undefined>(undefined);
