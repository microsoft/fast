import { storiesOf } from "@storybook/react";
import React from "react";
import { SelectOption } from "../select-option";
import { Select } from "./";
import { uniqueId } from "lodash-es";
import { action } from "@storybook/addon-actions";

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
    ));
