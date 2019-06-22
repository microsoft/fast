import React from "react";
import Dictionary from "./dictionary";
import Explorer from "./explorer";
import Preview from "./preview";
import { history } from "./config";
import { Route, Router } from "react-router-dom";

/**
 * The root level app
 *
 * This is where the routes are declared
 */
export default class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <Router history={history}>
                <div>
                    <Route component={Dictionary} exact={true} path="/" />
                    <Route
                        component={Explorer}
                        exact={true}
                        path="/components/:component"
                    />
                    <Route component={Preview} exact={true} path="/preview" />
                </div>
            </Router>
        );
    }
}
