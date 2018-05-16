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
                <Row>
                    hello world
                </Row>
                <Row fill={true}>
                    <Pane resizable={true} resizeFrom={PaneResizeDirection.east}>
                        <p>{(new Array(1000) as any).fill("pane").join(" ")}</p>
                    </Pane>
                    <Canvas>
                        canvas
                    </Canvas>

                    <Pane collapsed={true}>

                    </Pane>
                </Row>
            </Container>
        ),
        root
    );
}

render();
