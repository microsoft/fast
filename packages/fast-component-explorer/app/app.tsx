import React from "react";
import Explorer from "./explorer";
import Preview from "./preview";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { history, initialComponentRoute } from "./config";
import { Redirect, Route, Router, Switch } from "react-router-dom";

const creatorDesignSystem: DesignSystem = Object.assign({}, DesignSystemDefaults, {
    density: -2,
    backgroundColor:
        DesignSystemDefaults.neutralPalette[
            DesignSystemDefaults.neutralPalette.length - 1
        ],
});
/**
 * The root level app
 *
 * This is where the routes are declared
 */
export default class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <Router history={history}>
                <Switch>
                    <DesignSystemProvider designSystem={creatorDesignSystem}>
                        <Route
                            component={Explorer}
                            exact={true}
                            path="/components/:component"
                        />
                    </DesignSystemProvider>
                    <Route component={Preview} exact={true} path="/preview" />
                    <Route>
                        <Redirect to={initialComponentRoute} />
                    </Route>
                </Switch>
            </Router>
        );
    }
}
