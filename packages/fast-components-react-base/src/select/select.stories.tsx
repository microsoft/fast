import { storiesOf } from "@storybook/react";
import React from "react";
import ListboxItem from "../listbox-item";
import Select from "./";
import { uniqueId } from "lodash-es";
import { action } from "@storybook/addon-actions";
import { AxisPositioningMode } from "../viewport-positioner";

storiesOf("Select", module)
    .add("Default", () => (
        <Select onValueChange={action("onValueChange")}>
            <ListboxItem
                id={uniqueId()}
                value="Select option 1"
                children="Select option 1"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 2"
                children="Select option 2"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 3"
                children="Select option 3"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 4"
                children="Select option 4"
            />
        </Select>
    ))
    .add("Placeholder", () => (
        <Select placeholder="Select an option" onValueChange={action("onValueChange")}>
            <ListboxItem
                id={uniqueId()}
                value="Select option 1"
                children="Select option 1"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 2"
                children="Select option 2"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 3"
                children="Select option 3"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 4"
                children="Select option 4"
            />
        </Select>
    ))
    .add("Open", () => (
        <Select
            placeholder="Select an option"
            onValueChange={action("onValueChange")}
            isMenuOpen={true}
        >
            <ListboxItem
                id={uniqueId()}
                value="Select option 1"
                children="Select option 1"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 2"
                children="Select option 2"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 3"
                children="Select option 3"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 4"
                children="Select option 4"
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
            <ListboxItem
                id={uniqueId()}
                value="Select option 1"
                children="Select option 1"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 2"
                children="Select option 2"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 3"
                children="Select option 3"
            />
            <ListboxItem
                id={uniqueId()}
                value="Select option 4"
                children="Select option 4"
            />
        </Select>
    ));
