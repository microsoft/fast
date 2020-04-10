import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { action } from "@storybook/addon-actions";
import { TextArea } from "./";

/**
 * Simple state manager to track and update checked properties
 */
function TextAreaStateHandler(props: {
    children: (
        value: string,
        onChange: React.ChangeEventHandler<HTMLTextAreaElement>
    ) => JSX.Element;
}): JSX.Element {
    const [checked, setChecked]: [
        string,
        React.Dispatch<React.SetStateAction<string>>
    ] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        setChecked(e.target.value);
        action("onChange")(e);
    }

    return props.children(checked, handleChange);
}

storiesOf("Text area", module)
    .add("Unhandled", () => <TextArea onChange={action("onChange")} />)
    .add("Handled", () => {
        function render(
            value: string,
            onChange: React.ChangeEventHandler<HTMLTextAreaElement>
        ): JSX.Element {
            return <TextArea value={value} onChange={onChange} />;
        }
        return <TextAreaStateHandler>{render}</TextAreaStateHandler>;
    })
    .add("Placeholder", () => (
        <TextArea placeholder={"Placeholder"} onChange={action("onChange")} />
    ))
    .add("Disabled", () => <TextArea onChange={action("onChange")} disabled={true} />);
