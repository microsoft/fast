import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Creator from "./creator";

/**
 * Create the root node
 */
export default class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <Route component={Creator} exact={true} path="/" />
            </BrowserRouter>
        );
    }
}
