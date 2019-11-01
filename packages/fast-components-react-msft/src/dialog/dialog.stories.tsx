import { storiesOf } from "@storybook/react";
import React from "react";
import { Dialog } from "./";
import { AccentButton } from "../accent-button";
import { height } from "@microsoft/fast-components-styles-msft";

storiesOf("Dialog", module)
    .add("Default", () => <Dialog visible={true} />)
    .add("Modal", () => (
        <div
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            <AccentButton>Test button</AccentButton>
            <div
                draggable={true}
                style={{
                    background: "green",
                    width: "120px",
                }}
            >
                Drag me
            </div>
            <Dialog visible={true} modal={true}>
                <AccentButton>Test button</AccentButton>
                <div
                    draggable={true}
                    style={{
                        background: "green",
                        width: "120px",
                    }}
                >
                    Drag me
                </div>
            </Dialog>
        </div>
    ))
    .add("Custom size", () => (
        <Dialog visible={true} contentHeight="300px" contentWidth="500px" />
    ));
