import { storiesOf } from "@storybook/react";
import React from "react";
import NumberField from "./";

storiesOf("Number Field", module)
    .add("Default", () => <NumberField />)
    .add("Number Field with step", () => <NumberField step={0.1} />)
    .add("Number Field with min", () => <NumberField min={1} />)
    .add("Number Field with max", () => <NumberField max={100} />)
    .add("Number Field with value", () => <NumberField value={1} />)
    .add("Number Field with disabled", () => <NumberField disabled={true} />)
    .add("Number Field with readonly", () => <NumberField readOnly={true} />)
    .add("Number Field with required", () => <NumberField required={true} />)
    .add("Number Field with placeholder", () => (
        <NumberField placeholder={"Placeholder"} />
    ))
    .add("Number Field with name", () => <NumberField name={"inputName"} />);
