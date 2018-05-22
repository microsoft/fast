import * as React from "react";
import * as ReactDOM from "react-dom";
import Canvas from "../src/canvas";
import Container from "../src/container";
import Row from "../src/row";
import Pane, { PaneResizeDirection } from "../src/pane";

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
                <Row style={{background: "#CCC", height: "40px"}} />
                <Row fill={true}>
                    <Pane resizable={true} resizeFrom={PaneResizeDirection.east} style={{background: "#E6E6E6"}} />
                    <Canvas />

                    <Pane collapsed={true} style={{background: "#E1E1E1"}} />
                </Row>
            </Container>
        ),
        root
    );
}

render();
