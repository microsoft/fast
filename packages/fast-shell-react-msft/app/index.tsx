import * as React from "react";
import * as ReactDOM from "react-dom";
import Canvas from "../src/Canvas";
import Container from "../src/container";
import Row from "../src/row";
import Pane from "../src/pane";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        (
            <Container>
                <Row>
                    hello world
                </Row>
            </Container>
        ),
        root
    );
}

render();
