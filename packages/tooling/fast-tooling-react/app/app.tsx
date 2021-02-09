import React from "react";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { NavigationTestPage } from "./pages/navigation";
import ViewerPage from "./pages/viewer";
import ViewerContentPage from "./pages/viewer/content";
import { FormTestPage } from "./pages/form";
import { FormAndNavigationTestPage } from "./pages/form-and-navigation";
import { NavigationMenuTestPage } from "./pages/navigation-menu";
import { WebComponentTestPage } from "./pages/web-components";
import WebComponentViewerContent from "./pages/web-components/web-component-viewer-content";

class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <div>
                    {this.renderLinks()}
                    <Switch>
                        <Route
                            exact={true}
                            path={"/navigation-menu"}
                            component={NavigationMenuTestPage}
                        />
                        <Route
                            exact={true}
                            path={"/navigation"}
                            component={NavigationTestPage}
                        />
                        <Route exact={true} path={"/viewer"} component={ViewerPage} />
                        <Route
                            exact={true}
                            path={"/viewer/content"}
                            component={ViewerContentPage}
                        />
                        <Route exact={true} path={"/form"} component={FormTestPage} />
                        <Route
                            exact={true}
                            path={"/form-and-navigation"}
                            component={FormAndNavigationTestPage}
                        />
                        <Route
                            exact={true}
                            path={"/web-components"}
                            component={WebComponentTestPage}
                        />
                        <Route
                            exact={true}
                            path={"/web-components/content"}
                            component={WebComponentViewerContent}
                        />
                        <Route exact={true} path={"/"}>
                            <Redirect to={"/form"} />
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
                            <Link to="/navigation-menu">Navigation Menu</Link>
                        </li>
                        <li>
                            <Link to="/form">Form</Link>
                        </li>
                        <li>
                            <Link to="/navigation">Navigation</Link>
                        </li>
                        <li>
                            <Link to="/form-and-navigation">Form and Navigation</Link>
                        </li>
                        <li>
                            <Link to="/viewer">Viewer</Link>
                        </li>
                        <li>
                            <Link to="/web-components">Web Components</Link>
                        </li>
                    </ul>
                    <hr />
                </React.Fragment>
            );
        }
    }
}

export default App;
