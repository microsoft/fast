import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { uniqueId } from "lodash-es";
import { action } from "@storybook/addon-actions";
import { Toggle, ToggleHandledProps } from "./";

/**
 * Simple state manager to track and update selected properties
 */
function ToggleStateHandler(props: {
    children: (
        selected: boolean,
        onChange: React.ChangeEventHandler<HTMLInputElement>
    ) => JSX.Element;
}): JSX.Element {
    const [selected, setChecked]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState(true);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setChecked(e.target.checked);
        action("onChange")(e);
    }

    return props.children(selected, handleChange);
}

const toggleProps: Pick<
    ToggleHandledProps,
    "selectedMessage" | "unselectedMessage" | "statusMessageId" | "inputId"
> = {
    selectedMessage: "selected",
    unselectedMessage: "unselected",
    statusMessageId: uniqueId(),
    inputId: uniqueId(),
};

storiesOf("Toggle", module)
    .add("Unhandled", () => <Toggle {...toggleProps} />)
    .add("Handled", () => {
        function render(
            selected: boolean,
            onChange: React.ChangeEventHandler<HTMLInputElement>
        ): JSX.Element {
            return <Toggle {...toggleProps} selected={selected} onChange={onChange} />;
        }
        return <ToggleStateHandler>{render}</ToggleStateHandler>;
    })
    .add("Disabled", () => <Toggle {...toggleProps} disabled={true} />)
    .add("No Label", () => <Toggle inputId={uniqueId()} />)
    .add("Disabled unhandled", () => <Toggle {...toggleProps} disabled={true} />)
    .add("Disabled handled", () => (
        <Toggle {...toggleProps} selected={true} disabled={true} />
    ));
