import { storiesOf } from "@storybook/react";
import React, { ReactNode } from "react";
import ViewportPositioner, {
    AxisPositioningMode,
    ViewportContext,
    ViewportPositionerProps,
} from "./";
import Foundation from "@microsoft/fast-components-foundation-react";
import { ViewportPositionerVerticalPosition } from "./viewport-positioner.props";

const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
const anchorElement2: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

interface TestViewportProps {
    positionerProps: ViewportPositionerProps[];
}

interface TestViewportState {
    currentDataSetIndex: number;
}

class TestViewport extends React.Component<TestViewportProps, TestViewportState> {
    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: TestViewportProps) {
        super(props);

        this.state = {
            currentDataSetIndex: 0,
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
                {this.renderSwitcherUi()}
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
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        background: "yellow",
                                    }}
                                >
                                    Positioner
                                </div>
                            </ViewportPositioner>
                        </div>
                    </div>
                </ViewportContext.Provider>
            </div>
        );
    }

    private renderSwitcherUi = (): ReactNode => {
        if (this.props.positionerProps.length < 2) {
            return null;
        }
        return (
            <div>
                <button onClick={this.onClick}>Switch data</button>
            </div>
        );
    };

    private onClick = (event: React.MouseEvent): void => {
        const nextDataSetIndex: number = this.state.currentDataSetIndex + 1;
        this.setState({
            currentDataSetIndex:
                nextDataSetIndex < this.props.positionerProps.length
                    ? nextDataSetIndex
                    : 0,
        });
    };
}

storiesOf("Viewport Positioner", module)
    .add("Default", () => (
        <TestViewport
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    anchor: anchorElement,
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
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    defaultVerticalPosition:
                        ViewportPositionerVerticalPosition.uncontrolled,
                    scaleToFit: true,
                    anchor: anchorElement,
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
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    verticalAlwaysInView: true,
                    horizontalAlwaysInView: true,
                    anchor: anchorElement,
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
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.inset,
                    horizontalPositioningMode: AxisPositioningMode.inset,
                    verticalAlwaysInView: true,
                    horizontalAlwaysInView: true,
                    anchor: anchorElement,
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
            positionerProps={[
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    anchor: anchorElement,
                    style: {
                        height: "100px",
                        width: "100px",
                    },
                },
                {
                    verticalPositioningMode: AxisPositioningMode.adjacent,
                    horizontalPositioningMode: AxisPositioningMode.adjacent,
                    anchor: anchorElement2,
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
    ));
