import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import BasicPage from "./pages/basic-page";
import BasicPageViewerContent from "./pages/basic-page.viewer-content";
import DevicePage from "./pages/device-page";
import DevicePageViewerContent from "./pages/device-page.viewer-content";
import UpdatePropsPage from "./pages/update-props-page";
import UpdatePropsPageViewerContent from "./pages/update-props-page.viewer-content";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

const render: any = (): void => {
    ReactDOM.render(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact={true} component={BasicPage} />
                <Route
                    path="/basic-content"
                    exact={true}
                    component={BasicPageViewerContent}
                />
                <Route path="/device" exact={true} component={DevicePage} />
                <Route
                    path="/device-content"
                    exact={true}
                    component={DevicePageViewerContent}
                />
                <Route path="/update-props" exact={true} component={UpdatePropsPage} />
                <Route
                    path="/update-props-content"
                    exact={true}
                    component={UpdatePropsPageViewerContent}
                />
            </Switch>
        </BrowserRouter>,
        document.getElementById("root")
    );
};

render();
