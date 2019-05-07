import React from "react";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { NavigationTestPage } from "./pages/navigation";
import BasicPage from "./pages/viewer/basic-page";
import BasicPageViewerContent from "./pages/viewer/basic-page.viewer-content";
import CustomMessagePage from "./pages/viewer/custom-message-page";
import CustomMessagePageViewerContent from "./pages/viewer/custom-message-page.viewer-content";
import DevicePage from "./pages/viewer/device-page";
import DevicePageViewerContent from "./pages/viewer/device-page.viewer-content";
import UpdatePropsPage from "./pages/viewer/update-props-page";
import UpdatePropsViewerContent from "./pages/viewer/update-props-page.viewer-content";
import { CSSEditorTestPage } from "./pages/css-editor";
import { FormTestPage } from "./pages/form";
import { CSSPropertyEditorTestPage } from "./pages/css-property-editor";

class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <div>
                    {this.renderLinks()}
                    <Switch>
                        <Route
                            exact={true}
                            path={"/css-editor"}
                            component={CSSEditorTestPage}
                        />
                        <Route
                            exact={true}
                            path={"/css-property-editor"}
                            component={CSSPropertyEditorTestPage}
                        />
                        <Route
                            exact={true}
                            path={"/navigation"}
                            component={NavigationTestPage}
                        />
                        <Route
                            exact={true}
                            path={"/viewer/basic"}
                            component={BasicPage}
                        />
                        <Route
                            exact={true}
                            path={"/viewer/basic/content"}
                            component={BasicPageViewerContent}
                        />
                        <Route
                            exact={true}
                            path={"/viewer/custom-message"}
                            component={CustomMessagePage}
                        />
                        <Route
                            exact={true}
                            path={"/viewer/custom-message/content"}
                            component={CustomMessagePageViewerContent}
                        />
                        <Route
                            exact={true}
                            path={"/viewer/device"}
                            component={DevicePage}
                        />
                        <Route
                            exact={true}
                            path={"/viewer/device/content"}
                            component={DevicePageViewerContent}
                        />
                        <Route
                            exact={true}
                            path={"/viewer/update-props"}
                            component={UpdatePropsPage}
                        />
                        <Route
                            exact={true}
                            path={"/viewer/update-props/content"}
                            component={UpdatePropsViewerContent}
                        />
                        <Route exact={true} path={"/form"} component={FormTestPage} />
                        <Route exact={true} path={"/"}>
                            <Redirect to={"/navigation"} />
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }

    private renderLinks(): React.ReactNode {
        if (window.location.pathname.slice(-7) !== "content") {
            return (
                <React.Fragment>
                    <ul>
                        <li>
                            <Link to="/css-editor">CSS Editor</Link>
                        </li>
                        <li>
                            <Link to="/css-property-editor">CSS Property Editor</Link>
                        </li>
                        <li>
                            <Link to="/form">Form</Link>
                        </li>
                        <li>
                            <Link to="/navigation">Navigation</Link>
                        </li>
                        <li>
                            <span>Viewer</span>
                            <ul>
                                <li>
                                    <Link to="/viewer/basic">Basic</Link>
                                </li>
                                <li>
                                    <Link to="/viewer/custom-message">
                                        Custom message
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/viewer/device">Device</Link>
                                </li>
                                <li>
                                    <Link to="/viewer/update-props">Update props</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <hr />
                </React.Fragment>
            );
        }
    }
}

export default App;
