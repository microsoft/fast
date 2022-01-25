import { allComponents, provideFASTDesignSystem } from "@microsoft/fast-components";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./app";
import { AppSampleApp } from "./components/sample-app";
import { AppSamplePage } from "./components/sample-page";
import { appComponents } from "./custom-elements";
import { store } from "./state";

provideFASTDesignSystem()
    .register(allComponents)
    .withPrefix("app")
    .register(appComponents);

AppSampleApp;
AppSamplePage;

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
