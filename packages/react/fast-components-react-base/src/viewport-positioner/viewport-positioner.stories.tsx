import { storiesOf } from "@storybook/react";
import React, { ReactNode } from "react";
import { ViewportPositionerVerticalPosition } from "./viewport-positioner.props";
import ViewportPositioner, {
    AxisPositioningMode,
    ViewportContext,
    ViewportPositionerProps,
} from "./";

const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
const anchorElement2: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

interface TestViewportProps {
    positionerProps: ViewportPositionerProps[];
    positionerContents: React.ReactNode[];
}

interface TestViewportState {
    currentDataSetIndex: number;
    currentContentsIndex: number;
}

class TestViewport extends React.Component<TestViewportProps, TestViewportState> {
    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: TestViewportProps) {
        super(props);

        this.state = {
            currentDataSetIndex: 0,
            currentContentsIndex: 0,
        };
    }

    public render(): JSX.Element {
        return (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                }}
            >
                {this.renderPropsSwitcherUi()}
                {this.renderContentSwitcherUi()}
                <ViewportContext.Provider
                    value={{
                        viewport: this.rootElement,
                    }}
                >
                    <div
                        ref={this.rootElement}
                        style={{
                            height: "400px",
                            width: "400px",
                            margin: "50px",
                            overflow: "scroll",
                        }}
                    >
                        {this.props.children}
                        <div
                            style={{
                                height: "0",
                                width: "0",
                            }}
                        >
                            <ViewportPositioner
                                {...this.props.positionerProps[
                                    this.state.currentDataSetIndex
                                ]}
                            >
                                {
                                    this.props.positionerContents[
                                        this.state.currentContentsIndex
                                    ]
                                }
                            </ViewportPositioner>
                        </div>
                    </div>
                </ViewportContext.Provider>
            </div>
        );
    }

    private renderPropsSwitcherUi = (): ReactNode => {
        if (this.props.positionerProps.length < 2) {
            return null;
        }
        return (
            <div>
                <button onClick={this.onNextPropsClick}>Switch data</button>
            </div>
        );
    };

    private renderContentSwitcherUi = (): ReactNode => {
        if (this.props.positionerContents.length < 2) {
            return null;
        }
        return (
            <div>
                <button onClick={this.onNextContentsClick}>Switch Contents</button>
            </div>
        );
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private onNextPropsClick = (event: React.MouseEvent): void => {
        const nextDataSetIndex: number = this.state.currentDataSetIndex + 1;
        this.setState({
            currentDataSetIndex:
                nextDataSetIndex < this.props.positionerProps.length
                    ? nextDataSetIndex
                    : 0,
        });
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private onNextContentsClick = (event: React.MouseEvent): void => {
        const nextContentsIndex: number = this.state.currentContentsIndex + 1;
        this.setState({
            currentContentsIndex:
                nextContentsIndex < this.props.positionerContents.length
                    ? nextContentsIndex
                    : 0,
        });
    };
}

storiesOf("Viewport Positioner", module)
    .add("Default", () => (
        <TestViewport
            positionerContents={[
                <div
                    key="c1.1"
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "yellow",
                    }}
                >
                    Positioner
                </div>,
            ]}
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    anchor: anchorElement,
                    delayContentInstanciation: true,
                    style: {
                        height: "100px",
                        width: "100px",
                    },
                },
            ]}
        >
            <div
                style={{
                    height: "1200px",
                    width: "1200px",
                    padding: "500px",
                    background: "blue",
                }}
            >
                <div
                    ref={anchorElement}
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "green",
                    }}
                >
                    Anchor
                </div>
            </div>
        </TestViewport>
    ))
    .add("Squishy region", () => (
        <TestViewport
            positionerContents={[
                <div
                    key="c2.1"
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "yellow",
                    }}
                >
                    Positioner
                </div>,
            ]}
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    defaultVerticalPosition:
                        ViewportPositionerVerticalPosition.uncontrolled,
                    scaleToFit: true,
                    anchor: anchorElement,
                    delayContentInstanciation: true,
                },
            ]}
        >
            <div
                style={{
                    height: "1200px",
                    width: "1200px",
                    padding: "550px",
                    background: "blue",
                }}
            >
                <div
                    ref={anchorElement}
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "green",
                    }}
                >
                    Anchor
                </div>
            </div>
        </TestViewport>
    ))
    .add("Squishy region with thresholds", () => (
        <TestViewport
            positionerContents={[
                <div
                    key="c3.1"
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "yellow",
                    }}
                >
                    Positioner
                </div>,
            ]}
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalThreshold: 100,
                    verticalThreshold: 100,
                    defaultVerticalPosition:
                        ViewportPositionerVerticalPosition.uncontrolled,
                    scaleToFit: true,
                    anchor: anchorElement,
                    delayContentInstanciation: true,
                },
            ]}
        >
            <div
                style={{
                    height: "1200px",
                    width: "1200px",
                    padding: "550px",
                    background: "blue",
                }}
            >
                <div
                    ref={anchorElement}
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "green",
                    }}
                >
                    Anchor
                </div>
            </div>
        </TestViewport>
    ))
    .add("Always in view - adjacent", () => (
        <TestViewport
            positionerContents={[
                <div
                    key="c4.1"
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "yellow",
                    }}
                >
                    Positioner
                </div>,
            ]}
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    verticalAlwaysInView: true,
                    horizontalAlwaysInView: true,
                    anchor: anchorElement,
                    delayContentInstanciation: true,
                    style: {
                        height: "100px",
                        width: "100px",
                    },
                },
            ]}
        >
            <div
                style={{
                    height: "1200px",
                    width: "1200px",
                    padding: "550px",
                    background: "blue",
                }}
            >
                <div
                    ref={anchorElement}
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "green",
                    }}
                >
                    Anchor
                </div>
            </div>
        </TestViewport>
    ))
    .add("Always in view - inset", () => (
        <TestViewport
            positionerContents={[
                <div
                    key="c5.1"
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "yellow",
                    }}
                >
                    Positioner
                </div>,
            ]}
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.inset,
                    horizontalPositioningMode: AxisPositioningMode.inset,
                    verticalAlwaysInView: true,
                    horizontalAlwaysInView: true,
                    anchor: anchorElement,
                    delayContentInstanciation: true,
                    style: {
                        height: "100px",
                        width: "100px",
                    },
                },
            ]}
        >
            <div
                style={{
                    height: "1200px",
                    width: "1200px",
                    padding: "550px",
                    background: "blue",
                }}
            >
                <div
                    ref={anchorElement}
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "green",
                    }}
                >
                    Anchor
                </div>
            </div>
        </TestViewport>
    ))
    .add("Change anchors", () => (
        <TestViewport
            positionerContents={[
                <div
                    key="c6.1"
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "yellow",
                    }}
                >
                    Positioner
                </div>,
            ]}
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    anchor: anchorElement,
                    delayContentInstanciation: true,
                    style: {
                        height: "100px",
                        width: "100px",
                    },
                },
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    anchor: anchorElement2,
                    delayContentInstanciation: true,
                    style: {
                        height: "100px",
                        width: "100px",
                    },
                },
            ]}
        >
            <div
                style={{
                    height: "1200px",
                    width: "1200px",
                    padding: "550px",
                    background: "blue",
                }}
            >
                <div
                    ref={anchorElement}
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "green",
                    }}
                >
                    Anchor
                </div>
                <div
                    ref={anchorElement2}
                    style={{
                        margin: "120px",
                        height: "100px",
                        width: "100px",
                        background: "green",
                    }}
                >
                    Anchor2
                </div>
            </div>
        </TestViewport>
    ))
    .add("resizing", () => (
        <TestViewport
            positionerContents={[
                <div
                    key="c7.1"
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "yellow",
                    }}
                />,
                <div
                    key="c7.2"
                    style={{
                        height: "150px",
                        width: "150px",
                        background: "orange",
                    }}
                />,
            ]}
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    anchor: anchorElement,
                    delayContentInstanciation: true,
                    style: {
                        height: "fit-content",
                        width: "fit-content",
                    },
                },
            ]}
        >
            <div
                style={{
                    height: "1200px",
                    width: "1200px",
                    padding: "500px",
                    background: "blue",
                }}
            >
                <div
                    ref={anchorElement}
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "green",
                    }}
                >
                    Anchor
                </div>
            </div>
        </TestViewport>
    ));
