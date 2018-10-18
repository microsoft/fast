import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";

function render(): void {
    ReactDOM.render(<App />, document.getElementById("root"));
}

render();
