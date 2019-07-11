import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import Checkbox from "./";
import { uniqueId } from "lodash-es";
import Label from "../label";
import { action } from "@storybook/addon-actions";

/**
 * Simple state manager to track and update checked properties
 */
function CheckboxStateHandler(props: {
    children: (
        checked: boolean,
        onChange: React.ChangeEventHandler<HTMLInputElement>
    ) => JSX.Element;
}): JSX.Element {
    const [checked, setChecked]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState(true);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setChecked(e.target.checked);
        action("onChange")(e);
    }

    return props.children(checked, handleChange);
}

storiesOf("Checkbox", module)
    .add("Unhandled", () => (
        <Checkbox inputId={uniqueId()} onChange={action("onChange")} />
    ))
    .add("Handled", () => {
        function render(
            checked: boolean,
            onChange: React.ChangeEventHandler<HTMLInputElement>
        ): JSX.Element {
            return (
                <Checkbox inputId={uniqueId()} checked={checked} onChange={onChange} />
            );
        }
        return <CheckboxStateHandler>{render}</CheckboxStateHandler>;
    })
    .add("With label", () => {
        const id: string = uniqueId();
        return (
            <Checkbox inputId={id} onChange={action("onChange")}>
                <Label slot="label" htmlFor={id}>
                    Hello world
                </Label>
            </Checkbox>
        );
    })
    .add("Disabled", () => (
        <Checkbox inputId={uniqueId()} onChange={action("onChange")} disabled={true} />
    ));
