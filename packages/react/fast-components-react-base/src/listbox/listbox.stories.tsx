import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { uniqueId } from "lodash-es";
import React, { useState } from "react";
import ListboxItem, { ListboxItemProps } from "../listbox-item";
import Listbox, { ListboxProps } from "./";

/**
 * Simple state manager to track and update value properties
 */
function ListboxItemStateHandler(props: {
    children: (
        selected: string,
        onItemInvoked: ListboxProps["onItemInvoked"]
    ) => JSX.Element;
}): JSX.Element {
    const [value, setValue]: [
        string,
        React.Dispatch<React.SetStateAction<string>>
    ] = useState("");

    function handleChange(item: ListboxItemProps): void {
        setValue(item.value);
        action("onValueChange")(item);
    }

    return props.children(value, handleChange);
}

storiesOf("Listbox", module)
    .add("Uncontrolled", () => (
        <Listbox
            onItemInvoked={action("onItemInvoked")}
            onSelectedItemsChanged={action("onSelectedItemsChanged")}
        >
            <ListboxItem id={uniqueId()} value="Cat" children="Cat" />
            <ListboxItem id={uniqueId()} value="Dog" children="Dog" />
            <ListboxItem id={uniqueId()} value="Turtle" children="Turtle" />
        </Listbox>
    ))
    .add("Controlled", () => {
        function render(
            selected: string,
            onItemInvoked: (item: ListboxItemProps) => void
        ): JSX.Element {
            return (
                <Listbox
                    selectedItems={[selected]}
                    onItemInvoked={onItemInvoked}
                    onSelectedItemsChanged={action("onSelectedItemsChanged")}
                >
                    <ListboxItem id={uniqueId()} value="Cat" children="Cat" />
                    <ListboxItem id={uniqueId()} value="Dog" children="Dog" />
                    <ListboxItem id={uniqueId()} value="Turtle" children="Turtle" />
                </Listbox>
            );
        }

        return <ListboxItemStateHandler>{render}</ListboxItemStateHandler>;
    })
    .add("Disabled", () => (
        <Listbox
            onItemInvoked={action("onItemInvoked")}
            onSelectedItemsChanged={action("onSelectedItemsChanged")}
            disabled={true}
        >
            <ListboxItem id={uniqueId()} value="Cat" children="Cat" />
            <ListboxItem id={uniqueId()} value="Dog" children="Dog" />
            <ListboxItem id={uniqueId()} value="Turtle" children="Turtle" />
        </Listbox>
    ));
