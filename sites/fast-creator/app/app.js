import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Creator from "./creator";
/**
 * Create the root node
 */
export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route component={Creator} exact={true} path="/" />
            </BrowserRouter>
        );
    }
}
