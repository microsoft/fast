import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Creator from "./creator";
import Preview from "./preview";

/**
 * Create the root node
 */
export default class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <fast-design-system-provider
                    use-defaults
                    density="-2"
                    style={{ height: "100%" }}
                >
                    <Route component={Creator} exact={true} path="/" />
                    <Route component={Preview} exact={true} path="/preview" />
                </fast-design-system-provider>
            </BrowserRouter>
        );
    }
}
