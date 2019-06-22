import React from "react";
import Explorer from "./explorer";
import Preview from "./preview";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <div>
                    <Route component={Explorer} exact={true} path="/" />
                    <Route component={Preview} exact={true} path="/preview" />
                </div>
            </BrowserRouter>
        );
    }
}
