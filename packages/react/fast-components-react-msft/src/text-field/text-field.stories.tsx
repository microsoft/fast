import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { action } from "@storybook/addon-actions";
import { TextField, TextFieldType } from "./";

/**
 * Simple state manager to track and update checked properties
 */
function TextFieldStateHandler(props: {
    children: (
        value: string,
        onChange: React.ChangeEventHandler<HTMLInputElement>
    ) => JSX.Element;
}): JSX.Element {
    const [checked, setChecked]: [
        string,
        React.Dispatch<React.SetStateAction<string>>
    ] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setChecked(e.target.value);
        action("onChange")(e);
    }

    return props.children(checked, handleChange);
}

storiesOf("Text field", module)
    .add("Unhandled", () => <TextField onChange={action("onChange")} />)
    .add("Handled", () => {
        function render(
            value: string,
            onChange: React.ChangeEventHandler<HTMLInputElement>
        ): JSX.Element {
            return <TextField value={value} onChange={onChange} />;
        }
        return <TextFieldStateHandler>{render}</TextFieldStateHandler>;
    })
    .add("Placeholder", () => (
        <TextField placeholder={"Placeholder"} onChange={action("onChange")} />
    ))
    .add("Email", () => (
        <TextField
            placeholder={"Email"}
            type={TextFieldType.email}
            onChange={action("onChange")}
        />
    ))
    .add("Number", () => (
        <TextField
            placeholder={"Number"}
            type={TextFieldType.number}
            onChange={action("onChange")}
        />
    ))
    .add("Password", () => (
        <TextField
            placeholder={"Password"}
            type={TextFieldType.password}
            onChange={action("onChange")}
        />
    ))
    .add("Search", () => (
        <TextField
            placeholder={"Search"}
            type={TextFieldType.search}
            onChange={action("onChange")}
        />
    ))
    .add("Tel", () => (
        <TextField
            placeholder={"Tel"}
            type={TextFieldType.tel}
            onChange={action("onChange")}
        />
    ))
    .add("Url", () => (
        <TextField
            placeholder={"Url"}
            type={TextFieldType.url}
            onChange={action("onChange")}
        />
    ));
