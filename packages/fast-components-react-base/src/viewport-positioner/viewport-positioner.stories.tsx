import { storiesOf } from "@storybook/react";
import React from "react";
import ViewportPositioner, { AxisPositioningMode, ViewportPositionerProps } from "./";
import Foundation from "@microsoft/fast-components-foundation-react";
import { ViewportPositionerVerticalPosition } from "./viewport-positioner.props";
import { isNil } from "lodash-es";

const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

interface TestViewportProps {
    positionerProps: ViewportPositionerProps;
}

class TestViewport extends React.Component<TestViewportProps, {}> {
    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: TestViewportProps) {
        super(props);

        this.state = {};
    }

    public render(): JSX.Element {
        return (
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
                        {...this.props.positionerProps}
                        viewport={this.rootElement}
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
        );
    }
}

storiesOf("Viewport Positioner", module)
    .add("Default", () => (
        <TestViewport
            positionerProps={{
                verticalPositioningMode: AxisPositioningMode.adjacent,
                horizontalPositioningMode: AxisPositioningMode.adjacent,
                anchor: anchorElement,
                style: {
                    height: "100px",
                    width: "100px",
                },
            }}
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
            positionerProps={{
                verticalPositioningMode: AxisPositioningMode.adjacent,
                horizontalPositioningMode: AxisPositioningMode.adjacent,
                defaultVerticalPosition: ViewportPositionerVerticalPosition.uncontrolled,
                verticalThreshold: 0,
                horizontalThreshold: 0,
                anchor: anchorElement,
            }}
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
            positionerProps={{
                verticalPositioningMode: AxisPositioningMode.adjacent,
                horizontalPositioningMode: AxisPositioningMode.adjacent,
                verticalAlwaysInView: true,
                horizontalAlwaysInView: true,
                anchor: anchorElement,
                style: {
                    height: "100px",
                    width: "100px",
                },
            }}
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
            positionerProps={{
                verticalPositioningMode: AxisPositioningMode.inset,
                horizontalPositioningMode: AxisPositioningMode.inset,
                verticalAlwaysInView: true,
                horizontalAlwaysInView: true,
                anchor: anchorElement,
            }}
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
    ));
