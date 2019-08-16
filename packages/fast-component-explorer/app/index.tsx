import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin, withAITracking } from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

/**
 * Create Application Insights SDK for Telemetry
 * https://docs.microsoft.com/en-us/azure/azure-monitor/learn/nodejs-quick-start
 */
const browserHistory = createBrowserHistory({ basename: "" });
var reactPlugin = new ReactPlugin();
var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: "ecda4203-b38b-42ad-b181-f0f7f2b1d8fa",
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: { history: browserHistory },
        },
    },
});
appInsights.loadAppInsights();

const AppFoundation: any = withAITracking(
    reactPlugin,
    DragDropContext(HTML5Backend)(App)
);

function render(): void {
    ReactDOM.render(<AppFoundation />, root);
}

render();
