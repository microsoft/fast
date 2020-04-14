import { storiesOf } from "@storybook/react";
import React from "react";
import { AccentButton } from "../accent-button";
import { Dialog } from "./";

storiesOf("Dialog", module)
    .add("Default", () => <Dialog visible={true} />)
    .add("Modal", () => (
        <div
            style={{
                overflow: "scroll",
                height: "600px",
            }}
        >
            <div
                style={{
                    height: "1200px",
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
                    <div
                        style={{
                            height: "100%",
                            overflow: "auto",
                        }}
                    >
                        <div
                            style={{
                                height: "800px",
                                overflow: "auto",
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
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    ))
    .add("Custom size", () => (
        <Dialog visible={true} contentHeight="300px" contentWidth="500px" />
    ));
