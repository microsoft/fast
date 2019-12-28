import { storiesOf } from "@storybook/react";
import React from "react";
import { NumberField } from "./";
import API from "./.tmp/API.md";

storiesOf("Number field", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => <NumberField name="numberField" />)
    .add("Placeholder", () => (
        <NumberField name="NumberField" placeholder="Placeholder" />
    ))
    .add("Min, max, and step", () => (
        <NumberField name="NumberField" step={10} min={0} max={100} />
    ))
    .add("Disabled", () => <NumberField name="NumberField" disabled={true} />)
    .add("Required", () => <NumberField name="NumberField" required={true} />);
