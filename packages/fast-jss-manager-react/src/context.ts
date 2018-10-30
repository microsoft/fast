import * as React from "react";

/**
 * Create and export JSSManager consumer/provider components to be used by
 * the manageJss HOC and DesignSystemProvider
 */
const {
    Provider,
    Consumer,
}: {
    Provider: React.Provider<unknown>;
    Consumer: React.Consumer<unknown>;
} = React.createContext<unknown>({});

export { Provider, Consumer };
