import { storiesOf } from "@storybook/react";
import React from "react";
import { SelectOption } from "../select-option";
import { Heading, HeadingSize } from "../heading";
import { Select } from "./";
import { uniqueId } from "lodash-es";
import { action } from "@storybook/addon-actions";
import { AxisPositioningMode } from "@microsoft/fast-components-react-base";
import { Dialog } from "../dialog";
import API from "./API.md";

const rootElement: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

storiesOf("Select", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
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
    .add("Adjacent", () => (
        <Select
            placeholder="Select an option"
            onValueChange={action("onValueChange")}
            menuFlyoutConfig={{
                horizontalPositioningMode: AxisPositioningMode.adjacent,
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
    .add("Scaling in dialog", () => (
        <Dialog modal={true} visible={true}>
            <div
                ref={rootElement}
                style={{
                    height: "100%",
                    width: "100%",
                    overflowY: "scroll",
                    overflowX: "hidden",
                }}
            >
                <div
                    style={{
                        height: "1000px",
                    }}
                >
                    <Select
                        style={{
                            margin: "350px 0 0 20px",
                            width: "180px",
                        }}
                        placeholder="Select an option"
                        onValueChange={action("onValueChange")}
                        menuFlyoutConfig={{
                            viewport: rootElement,
                            horizontalPositioningMode: AxisPositioningMode.uncontrolled,
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
