import * as React from "react";
import { IDesignSystemProviderProps } from "./design-system-provider";

const { Provider, Consumer }: {
    Provider: React.Provider<IDesignSystemProviderProps<any>>,
    Consumer: React.Consumer<IDesignSystemProviderProps<any>>
} = React.createContext<IDesignSystemProviderProps<any>>({ designSystem: {} });

export { Provider, Consumer };
