import { storiesOf } from "@storybook/react";
import React from "react";
import { uniqueId } from "lodash-es";
import { action } from "@storybook/addon-actions";
import {
    AxisPositioningMode,
    ViewportPositionerHorizontalPosition,
    ViewportPositionerVerticalPosition,
} from "@microsoft/fast-components-react-base";
import { Heading, HeadingSize } from "../heading";
import { SelectOption } from "../select-option";
import { Dialog } from "../dialog";
import { Select } from "./";

const rootElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

storiesOf("Select", module)
    .add("Default", () => (
        <Select onValueChange={action("onValueChange")}>
            <SelectOption
                id={uniqueId()}
                value="Select option 1"
                displayString="Select option 1"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 2"
                displayString="Select option 2"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 3"
                displayString="Select option 3"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 4"
                displayString="Select option 4"
            />
        </Select>
    ))
    .add("Placeholder", () => (
        <Select placeholder="Select an option" onValueChange={action("onValueChange")}>
            <SelectOption
                id={uniqueId()}
                value="Select option 1"
                displayString="Select option 1"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 2"
                displayString="Select option 2"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 3"
                displayString="Select option 3"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 4"
                displayString="Select option 4"
            />
        </Select>
    ))
    .add("With label", () => (
        <div>
            <Heading
                size={HeadingSize._4}
                id="selectHeading"
                style={{
                    margin: "0 0 20px 0",
                }}
            >
                Select heading
            </Heading>
            <Select
                labelledBy="selectHeading"
                placeholder="Select an option"
                onValueChange={action("onValueChange")}
            >
                <SelectOption
                    id={uniqueId()}
                    value="Select option 1"
                    displayString="Select option 1"
                />
                <SelectOption
                    id={uniqueId()}
                    value="Select option 2"
                    displayString="Select option 2"
                />
                <SelectOption
                    id={uniqueId()}
                    value="Select option 3"
                    displayString="Select option 3"
                />
                <SelectOption
                    id={uniqueId()}
                    value="Select option 4"
                    displayString="Select option 4"
                />
            </Select>
        </div>
    ))
    .add("Open", () => (
        <Select
            placeholder="Select an option"
            onValueChange={action("onValueChange")}
            isMenuOpen={true}
        >
            <SelectOption
                id={uniqueId()}
                value="Select option 1"
                displayString="Select option 1"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 2"
                displayString="Select option 2"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 3"
                displayString="Select option 3"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 4"
                displayString="Select option 4"
            />
        </Select>
    ))
    .add("Multi", () => (
        <Select
            placeholder="Select an option"
            onValueChange={action("onValueChange")}
            multiselectable={true}
        >
            <SelectOption
                id={uniqueId()}
                value="Select option 1"
                displayString="Select option 1"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 2"
                displayString="Select option 2"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 3"
                displayString="Select option 3"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 4"
                displayString="Select option 4"
            />
        </Select>
    ))
    .add("Right", () => (
        <Select
            placeholder="Select an option"
            onValueChange={action("onValueChange")}
            menuFlyoutConfig={{
                horizontalPositioningMode: AxisPositioningMode.adjacent,
                defaultHorizontalPosition: ViewportPositionerHorizontalPosition.right,
                horizontalLockToDefault: true,
                verticalPositioningMode: AxisPositioningMode.inset,
            }}
        >
            <SelectOption
                id={uniqueId()}
                value="Select option 1"
                displayString="Select option 1"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 2"
                displayString="Select option 2"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 3"
                displayString="Select option 3"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 4"
                displayString="Select option 4"
            />
        </Select>
    ))
    .add("left", () => (
        <Select
            style={{
                marginLeft: "200px",
            }}
            placeholder="Select an option"
            onValueChange={action("onValueChange")}
            menuFlyoutConfig={{
                horizontalPositioningMode: AxisPositioningMode.adjacent,
                defaultHorizontalPosition: ViewportPositionerHorizontalPosition.left,
                horizontalLockToDefault: true,
                verticalPositioningMode: AxisPositioningMode.inset,
            }}
        >
            <SelectOption
                id={uniqueId()}
                value="Select option 1"
                displayString="Select option 1"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 2"
                displayString="Select option 2"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 3"
                displayString="Select option 3"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 4"
                displayString="Select option 4"
            />
        </Select>
    ))
    .add("Above", () => (
        <Select
            style={{
                marginTop: "200px",
            }}
            placeholder="Select an option"
            onValueChange={action("onValueChange")}
            menuFlyoutConfig={{
                verticalPositioningMode: AxisPositioningMode.adjacent,
                verticalLockToDefault: true,
                defaultVerticalPosition: ViewportPositionerVerticalPosition.top,
            }}
        >
            <SelectOption
                id={uniqueId()}
                value="Select option 1"
                displayString="Select option 1"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 2"
                displayString="Select option 2"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 3"
                displayString="Select option 3"
            />
            <SelectOption
                id={uniqueId()}
                value="Select option 4"
                displayString="Select option 4"
            />
        </Select>
    ))
    .add("Scaling", () => (
        <Dialog modal={true} visible={true}>
            <div
                ref={rootElement}
                style={{
                    height: "100%",
                    width: "100%",
                    overflowY: "scroll",
                    overflowX: "scroll",
                }}
            >
                <div
                    style={{
                        height: "1000px",
                        width: "1000px",
                    }}
                >
                    <Select
                        style={{
                            margin: "350px 0 0 300px",
                            width: "180px",
                        }}
                        placeholder="Select an option"
                        onValueChange={action("onValueChange")}
                        menuFlyoutConfig={{
                            viewport: rootElement,
                            verticalPositioningMode: AxisPositioningMode.adjacent,
                            scaleToFit: true,
                        }}
                    >
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 1"
                            displayString="Select option 1"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 2"
                            displayString="Select option 2"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 3"
                            displayString="Select option 3"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 4"
                            displayString="Select option 4"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 1"
                            displayString="Select option 1"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 2"
                            displayString="Select option 2"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 3"
                            displayString="Select option 3"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 4"
                            displayString="Select option 4"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 1"
                            displayString="Select option 1"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 2"
                            displayString="Select option 2"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 3"
                            displayString="Select option 3"
                        />
                        <SelectOption
                            id={uniqueId()}
                            value="Select option 4"
                            displayString="Select option 4"
                        />
                    </Select>
                </div>
            </div>
        </Dialog>
    ))
    .add("Disabled", () => (
        <Select onValueChange={action("onValueChange")} disabled={true} />
    ));
