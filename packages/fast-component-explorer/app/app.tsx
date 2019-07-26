import React from "react";
import Dictionary from "./dictionary";
import Explorer from "./explorer";
import Preview from "./preview";
import { history } from "./config";
import { Route, Router } from "react-router-dom";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";

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
                <div>
                    <Route component={Dictionary} exact={true} path="/" />
                    <DesignSystemProvider designSystem={creatorDesignSystem}>
                        <Route
                            component={Explorer}
                            exact={true}
                            path="/components/:component"
                        />
                    </DesignSystemProvider>
                    <Route component={Preview} exact={true} path="/preview" />
                </div>
            </Router>
        );
    }
}
