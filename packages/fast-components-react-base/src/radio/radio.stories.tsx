import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { uniqueId } from "lodash-es";
import { action } from "@storybook/addon-actions";
import Label from "../label";
import Radio from "./";

/**
 * Simple state manager to track and update checked properties
 */
function RadioStateHandler(props: {
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

storiesOf("Radio", module)
    .add("Uncontrolled", () => <Radio inputId={uniqueId()} />)
    .add("Controlled", () => {
        function render(
            checked: boolean,
            onChange: React.ChangeEventHandler<HTMLInputElement>
        ): JSX.Element {
            return <Radio inputId={uniqueId()} checked={checked} onChange={onChange} />;
        }
        return <RadioStateHandler>{render}</RadioStateHandler>;
    })
    .add("Disabled", () => <Radio inputId={uniqueId()} disabled={true} />)
    .add("With slot label", () => {
        const id: string = uniqueId();

        return (
            <Radio inputId={id} checked={true} onChange={action("onChange")}>
                <Label slot="label" htmlFor={id}>
                    Hello slot
                </Label>
            </Radio>
        );
    })
    .add("With label", () => {
        const id: string = uniqueId();
        const label: (className: string) => React.ReactNode = (
            className: string
        ): React.ReactNode => (
            <Label className={className} htmlFor={id}>
                Hello render prop
            </Label>
        );

        return <Radio inputId={id} label={label} onChange={action("onChange")} />;
    });
