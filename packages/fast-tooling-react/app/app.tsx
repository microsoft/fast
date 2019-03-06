import React from "react";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { NavigationTestPage } from "./pages/navigation";

class App extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <div>
                    <ul>
                        <li>
                            <Link to="/navigation">Navigation Tool</Link>
                        </li>
                    </ul>
                    <hr />
                    <Switch>
                        <Route
                            exact={true}
                            path={"/navigation"}
                            component={NavigationTestPage}
                        />
                        <Route exact={true} path={"/"}>
                            <Redirect to={"/navigation"} />
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
