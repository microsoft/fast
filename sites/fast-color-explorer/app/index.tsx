import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@microsoft/fast-components";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./app";
import * as appComponents from "./custom-elements";
import { store } from "./state";

// eslint-disable-next-line @typescript-eslint/typedef
DesignSystem.getOrCreate().register(Object.values(allComponents).map(x => x()));

export const appDesignSystem = DesignSystem.getOrCreate()
    .withPrefix("app")
    .register(
        // eslint-disable-next-line @typescript-eslint/typedef
        ...Object.values(appComponents).map(x => x())
    );

appDesignSystem;

/**
 * Create the root node
 */
function render(): void {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById("root")
    );
}

render();
