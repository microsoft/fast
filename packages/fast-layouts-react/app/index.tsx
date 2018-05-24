import * as React from "react";
import * as ReactDOM from "react-dom";
import Canvas from "../src/canvas";
import Container from "../src/container";
import Row from "../src/row";
import Pane, { PaneResizeDirection } from "../src/pane";
import Page from "../src/page";
import Grid from "../src/grid";
import Column from "../src/column";

const gridTestStyles: string = `
    .test-grid > div {
        background-color: rgba(0, 120, 212, 0.2);
        border: 2px solid rgba(0, 120, 212, 0.2);
        min-height: 30px;
        margin: 4px 0;
    }
`;

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        (
            <React.Fragment>
                <style>
                    {gridTestStyles}
                </style>
                <Container>
                    <Row style={{background: "#CCC", height: "40px"}} />
                    <Row fill={true}>
                        <Pane resizable={true} resizeFrom={PaneResizeDirection.east} style={{background: "#E6E6E6"}} />
                        <Canvas>
                        <Page>
                            <Grid className="test-grid" key={"breakpoint-specific-spans"} row={1}>
                                <Column span={12} />
                                <Column span={[12, 6, 6, 4]} row={2} />
                                <Column span={[12, 6, 6, 4]} row={[3, 2]} position={[1, 7, 7, 5]} />
                                <Column span={[12, 12, 12, 4]} row={[4, 3, 3, 2]} position={[1, 1, 1, 9]} />
                            </Grid>
                        </Page>
                        </Canvas>
                        <Pane collapsed={true} style={{background: "#E1E1E1"}} />
                    </Row>
                </Container>
            </React.Fragment>
        ),
        root
    );
}

render();
