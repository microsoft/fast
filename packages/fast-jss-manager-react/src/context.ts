import * as React from "react";

/**
 * Create and export JSSManager consumer/provider components to be used by
 * the manageJss HOC and DesignSystemProvider
 */
const designSystemContext: React.Context<unknown> = React.createContext<unknown>({});
const {
    Provider,
    Consumer,
}: {
    Provider: React.Provider<unknown>;
    Consumer: React.Consumer<unknown>;
} = designSystemContext;

export { Provider, Consumer, designSystemContext };
