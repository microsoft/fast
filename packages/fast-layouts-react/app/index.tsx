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
                            <Grid className="test-grid" key={"twelve-column-grid"}>
                                <Column span={12} row={1}>
                                    <p>Twelve column grid</p>
                                </Column>
                                <Column span={12} row={2}>Full span column</Column>
                                <Column position={1} span={6} row={3}>Two-up column</Column>
                                <Column position={7} span={6} row={3}>Two-up column</Column>
                                <Column position={1} span={4} row={4}>Three-up column</Column>
                                <Column position={5} span={4} row={4}>Three-up column</Column>
                                <Column position={9} span={4} row={4}>Three-up column</Column>
                                <Column position={1} span={3} row={5}>Four-up column</Column>
                                <Column position={4} span={3} row={5}>Four-up column</Column>
                                <Column position={7} span={3} row={5}>Four-up column</Column>
                                <Column position={10} span={3} row={5}>Four-up column</Column>
                                <Column position={1} span={2} row={6}>Six-up column</Column>
                                <Column position={3} span={2} row={6}>Six-up column</Column>
                                <Column position={5} span={2} row={6}>Six-up column</Column>
                                <Column position={7} span={2} row={6}>Six-up column</Column>
                                <Column position={9} span={2} row={6}>Six-up column</Column>
                                <Column position={11} span={2} row={6}>Six-up column</Column>
                                <Column position={1} span={1} row={7} order={1}>Column</Column>
                                <Column position={2} span={1} row={7}>Column</Column>
                                <Column position={3} span={1} row={7}>Column</Column>
                                <Column position={4} span={1} row={7}>Column</Column>
                                <Column position={5} span={1} row={7}>Column</Column>
                                <Column position={6} span={1} row={7}>Column</Column>
                                <Column position={7} span={1} row={7}>Column</Column>
                                <Column position={8} span={1} row={7}>Column</Column>
                                <Column position={9} span={1} row={7}>Column</Column>
                                <Column position={10} span={1} row={7}>Column</Column>
                                <Column position={11} span={1} row={7}>Column</Column>
                                <Column position={12} span={1} row={7}>Column</Column>
                            </Grid>
                            <Grid className="test-grid" key={"eight-column-grid"} columnCount={8} row={2}>
                                <Column span={8}>
                                    <p>Eight column grid</p>
                                </Column>
                                <Column position={1} span={1} row={2}>Column</Column>
                                <Column position={2} span={1} row={2}>Column</Column>
                                <Column position={3} span={1} row={2}>Column</Column>
                                <Column position={4} span={1} row={2}>Column</Column>
                                <Column position={5} span={1} row={2}>Column</Column>
                                <Column position={6} span={1} row={2}>Column</Column>
                                <Column position={7} span={1} row={2}>Column</Column>
                                <Column position={8} span={1} row={2}>Column</Column>
                            </Grid>
                            <Grid className="test-grid" key={"five-column-grid"} row={3} columnCount={5}>
                                <Column span={5}>
                                    <p>Five column grid</p>
                                </Column>
                                <Column span={1} row={2} position={1}>Column</Column>
                                <Column span={1} row={2} position={2}>Column</Column>
                                <Column span={1} row={2} position={3}>Column</Column>
                                <Column span={1} row={2} position={4}>Column</Column>
                                <Column span={1} row={2} position={5}>Column</Column>
                            </Grid>
                            <Grid className="test-grid" key={"breakpoint-specific-spans"} row={4}>
                                <Column span={12}>
                                    <p>Break-point specific column spans</p>
                                </Column>
                                <Column span={[12, 6, 6, 4]} row={2}>
                                    <p>Multiple column-spans</p>
                                </Column>
                                <Column span={[12, 6, 6, 4]} row={[3, 2]} position={[1, 7, 7, 5]}>
                                    <p>Multiple column-spans</p>
                                </Column>
                                <Column span={[12, 12, 12, 4]} row={[4, 3, 3, 2]} position={[1, 1, 1, 9]}>
                                    <p>Multiple column-spans</p>
                                </Column>
                            </Grid>
                            <Grid className="test-grid" key={"column-offsets"} row={5}>
                                <Column span={12}>
                                    <p>Column offsets</p>
                                </Column>
                                <Column position={1} span={12} row={2}>
                                    <p>Offset</p>
                                </Column>
                                <Column position={2} span={10} row={3}>
                                    <p>Offset</p>
                                </Column>
                                <Column position={3} span={8} row={4}>
                                    <p>Offset</p>
                                </Column>
                                <Column position={4} span={6} row={5}>
                                    <p>Offset</p>
                                </Column>
                                <Column position={5} span={4} row={6}>
                                    <p>Offset</p>
                                </Column>
                                <Column position={6} span={2} row={7}>
                                    <p>Offset</p>
                                </Column>
                            </Grid>
                            <Grid className="test-grid" key={"no-gutter"} gutter={0} row={6}>
                                <Column span={12}>
                                    <p>No gutter</p>
                                </Column>
                                <Column span={1} row={2} position={1}>Column</Column>
                                <Column span={1} row={2} position={2}>Column</Column>
                                <Column span={1} row={2} position={3}>Column</Column>
                                <Column span={1} row={2} position={4}>Column</Column>
                                <Column span={1} row={2} position={5}>Column</Column>
                                <Column span={1} row={2} position={6}>Column</Column>
                                <Column span={1} row={2} position={7}>Column</Column>
                                <Column span={1} row={2} position={8}>Column</Column>
                                <Column span={1} row={2} position={9}>Column</Column>
                                <Column span={1} row={2} position={10}>Column</Column>
                                <Column span={1} row={2} position={11}>Column</Column>
                                <Column span={1} row={2} position={12}>Column</Column>
                            </Grid>
                            <Grid className="test-grid" key={"8px-gutter"} gutter={8} row={7}>
                                <Column span={12}>
                                    <p>8px gutter</p>
                                </Column>
                                <Column span={1} row={2} position={1}>Column</Column>
                                <Column span={1} row={2} position={2}>Column</Column>
                                <Column span={1} row={2} position={3}>Column</Column>
                                <Column span={1} row={2} position={4}>Column</Column>
                                <Column span={1} row={2} position={5}>Column</Column>
                                <Column span={1} row={2} position={6}>Column</Column>
                                <Column span={1} row={2} position={7}>Column</Column>
                                <Column span={1} row={2} position={8}>Column</Column>
                                <Column span={1} row={2} position={9}>Column</Column>
                                <Column span={1} row={2} position={10}>Column</Column>
                                <Column span={1} row={2} position={11}>Column</Column>
                                <Column span={1} row={2} position={12}>Column</Column>
                            </Grid>
                            <Grid className="test-grid" key={"12px-gutter"} gutter={12} row={8}>
                                <Column span={12}>
                                    <p>12px gutter</p>
                                </Column>
                                <Column span={1} row={2} position={1}>Column</Column>
                                <Column span={1} row={2} position={2}>Column</Column>
                                <Column span={1} row={2} position={3}>Column</Column>
                                <Column span={1} row={2} position={4}>Column</Column>
                                <Column span={1} row={2} position={5}>Column</Column>
                                <Column span={1} row={2} position={6}>Column</Column>
                                <Column span={1} row={2} position={7}>Column</Column>
                                <Column span={1} row={2} position={8}>Column</Column>
                                <Column span={1} row={2} position={9}>Column</Column>
                                <Column span={1} row={2} position={10}>Column</Column>
                                <Column span={1} row={2} position={11}>Column</Column>
                                <Column span={1} row={2} position={12}>Column</Column>
                            </Grid>
                            <Grid className="test-grid" key={"24px-gutter"} gutter={24} row={9}>
                                <Column span={12}>
                                    <p>24px gutter</p>
                                </Column>
                                <Column span={1} row={2} position={1}>Column</Column>
                                <Column span={1} row={2} position={2}>Column</Column>
                                <Column span={1} row={2} position={3}>Column</Column>
                                <Column span={1} row={2} position={4}>Column</Column>
                                <Column span={1} row={2} position={5}>Column</Column>
                                <Column span={1} row={2} position={6}>Column</Column>
                                <Column span={1} row={2} position={7}>Column</Column>
                                <Column span={1} row={2} position={8}>Column</Column>
                                <Column span={1} row={2} position={9}>Column</Column>
                                <Column span={1} row={2} position={10}>Column</Column>
                                <Column span={1} row={2} position={11}>Column</Column>
                                <Column span={1} row={2} position={12}>Column</Column>
                            </Grid>
                            <Grid className="test-grid" key={"breakpoint-specific-gutter"} gutter={[24, 24, 36, 36, 48, 48]} row={10}>
                                <Column span={12}>
                                    <p>Breakpoint specific gutter</p>
                                </Column>
                                <Column span={1} row={2} position={1}>Column</Column>
                                <Column span={1} row={2} position={2}>Column</Column>
                                <Column span={1} row={2} position={3}>Column</Column>
                                <Column span={1} row={2} position={4}>Column</Column>
                                <Column span={1} row={2} position={5}>Column</Column>
                                <Column span={1} row={2} position={6}>Column</Column>
                                <Column span={1} row={2} position={7}>Column</Column>
                                <Column span={1} row={2} position={8}>Column</Column>
                                <Column span={1} row={2} position={9}>Column</Column>
                                <Column span={1} row={2} position={10}>Column</Column>
                                <Column span={1} row={2} position={11}>Column</Column>
                                <Column span={1} row={2} position={12}>Column</Column>
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
