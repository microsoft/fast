import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import ExplorerRegion from "./explorer-region";
import Preview from "./preview";
import { history, initialComponentRoute } from "./config";
import { FASTDesignSystemProvider } from "@microsoft/fast-components";

FASTDesignSystemProvider;

/**
 * The root level app
 *
 * This is where the routes are declared
 */
export default class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <fast-design-system-provider use-defaults>
                <Router history={history}>
                    <Switch>
                        <Route
                            component={ExplorerRegion}
                            exact={true}
                            path="/components/:component"
                        />
                        <Route component={Preview} exact={true} path="/preview" />
                        <Route>
                            <Redirect to={initialComponentRoute} />
                        </Route>
                    </Switch>
                </Router>
            </fast-design-system-provider>
        );
    }
}
