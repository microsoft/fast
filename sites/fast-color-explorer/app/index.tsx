import { fastAnchor } from "@microsoft/fast-components";
import { DesignSystem } from "@microsoft/fast-foundation";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./app";
import { store } from "./state";

DesignSystem.getOrCreate().register(fastAnchor());

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
