import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents, provideFASTDesignSystem } from "@microsoft/fast-components";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./app";
import { AppSampleApp } from "./components/sample-app";
import { AppSamplePage } from "./components/sample-page";
import * as appComponents from "./custom-elements";
import { store } from "./state";

provideFASTDesignSystem().register(allComponents);

DesignSystem.getOrCreate()
    .withPrefix("app")
    .register(
        // eslint-disable-next-line @typescript-eslint/typedef
        ...Object.values(appComponents).map(x => x())
    );

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
