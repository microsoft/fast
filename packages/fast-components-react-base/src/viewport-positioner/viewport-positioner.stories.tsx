import { storiesOf } from "@storybook/react";
import React from "react";
import ViewportPositioner from "./";
import { AxisPositioningMode } from "./viewport-positioner.props";
import Foundation from "@microsoft/fast-components-foundation-react";

const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

const rootElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

storiesOf("Viewport Positioner", module).add("Default", () => (
    <div
        ref={rootElement}
        style={{
            height: "400px",
            width: "400px",
            overflow: "scroll",
        }}
    >
        <div
            style={{
                height: "600px",
                width: "600px",
                padding: "250px",
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
        <ViewportPositioner
            verticalPositioningMode={AxisPositioningMode.adjacent}
            horizontalPositioningMode={AxisPositioningMode.adjacent}
            anchor={anchorElement}
            viewport={rootElement}
            style={{
                height: "100px",
                width: "100px",
                background: "yellow",
            }}
        >
            Positioner
        </ViewportPositioner>
    </div>
));
