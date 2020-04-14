import { storiesOf } from "@storybook/react";
import React from "react";
import { TextFieldType } from "./text-field.props";
import TextField from "./";

storiesOf("Text Field", module)
    .add("Default", () => <TextField />)
    .add("Text Field with type `email`", () => <TextField type={TextFieldType.email} />)
    .add("Text Field with type `number`", () => <TextField type={TextFieldType.number} />)
    .add("Text Field with type `password`", () => (
        <TextField type={TextFieldType.password} />
    ))
    .add("Text Field with type `search`", () => <TextField type={TextFieldType.search} />)
    .add("Text Field with type `tel`", () => <TextField type={TextFieldType.tel} />)
    .add("Text Field with type `text`", () => <TextField type={TextFieldType.text} />)
    .add("Text Field with type `url`", () => <TextField type={TextFieldType.url} />)
    .add("Text Field with disabled", () => <TextField disabled={true} />)
    .add("Text Field with readonly", () => <TextField readOnly={true} />)
    .add("Text Field with required", () => <TextField required={true} />)
    .add("Text Field with placeholder", () => <TextField placeholder={"Placeholder"} />)
    .add("Text Field with name", () => <TextField name={"inputName"} />);
