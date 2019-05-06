import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { Provider } from "react-redux";
import { store } from "./state";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        root
    );
}

render();
