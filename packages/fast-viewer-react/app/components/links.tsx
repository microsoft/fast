import React from "react";
import { Link } from "react-router-dom";

export default class Links extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                <Link to="/">basic</Link> | <Link to="/device">device</Link> |{" "}
                <Link to="/update-props">update props</Link>
                <br />
            </React.Fragment>
        );
    }
}
