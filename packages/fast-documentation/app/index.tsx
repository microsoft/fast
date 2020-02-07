import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, RouteProps, Switch, withRouter } from "react-router-dom";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { HomePage } from "./pages";
import { designSystemDefaults, Footer } from "../src";
import Navigation from "../src/navigation/navigation";
import { NavData } from "../app/data/site-data";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

const Nav: any = withRouter((props: RouteProps) => <Navigation NavData={NavData} routeProps={props} />);

function render(): void {
    // tslint:disable:jsx-no-lambda
    ReactDOM.render(
        <DesignSystemProvider designSystem={designSystemDefaults}>
            <Router>
                <Nav />
                <Switch>
                    <Route exact={true} path={"/"} render={(): JSX.Element => <HomePage />} />
                </Switch>
                <Footer />
            </Router>
        </DesignSystemProvider>,
        document.getElementById("root")
    );
}

render();
