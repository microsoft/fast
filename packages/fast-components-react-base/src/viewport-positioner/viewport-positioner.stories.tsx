import { storiesOf } from "@storybook/react";
import React from "react";
import ViewportPositioner from "./";

const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
    HTMLDivElement
>();
const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
    HTMLDivElement
>();

storiesOf("Viewport Positioner", module)
    .add("Default", () => (
        <div
            id="view"
            style={{
                position: "relative",
                height: "1000px",
                width: "1000px",
                padding: "100px",
                background: "blue"
            }}
        >
            <div
                ref={anchorElement}
                style={{
                    height: "100px",
                    width: "100px",
                    background: "green"
                }}
            >
                Anchor
            </div>
            <ViewportPositioner
                viewport={viewportElement}
                anchor={anchorElement}
                style={{
                    height: "100px",
                    width: "100px",
                    background: "yellow"
                }}
            >
                Positioner
            </ViewportPositioner>
        </div>
));
