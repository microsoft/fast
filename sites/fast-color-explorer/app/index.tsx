import {
    allComponents as fastComponents,
    provideFASTDesignSystem,
} from "@microsoft/fast-components";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./app";
import { store } from "./state";

provideFASTDesignSystem().register(fastComponents);

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
