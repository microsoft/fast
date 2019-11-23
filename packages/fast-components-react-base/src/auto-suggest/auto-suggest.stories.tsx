import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { uniqueId } from "lodash-es";
import React, { useState } from "react";
import AutoSuggest, { AutoSuggestProps } from "./";
import ListboxItem from "../listbox-item";
import { MenuTriggers } from "./auto-suggest.props";

/**
 * Simple state manager to track and update value properties
 */
function AutoSuggestStateHandler(props: {
    children: (
        selected: string,
        onChange: AutoSuggestProps["onValueChange"]
    ) => JSX.Element;
}): JSX.Element {
    const [value, setValue]: [
        string,
        React.Dispatch<React.SetStateAction<string>>
    ] = useState("");

    function handleChange(v: string): void {
        setValue(v);
        action("onValueChange")(v);
    }

    return props.children(value, handleChange);
}
const favoriteAnimalProps: Pick<
    AutoSuggestProps,
    "placeholder" | "listboxId" | "label"
> = {
    placeholder: "Favorite animal",
    listboxId: uniqueId(),
    label: "Select your favorite animal",
};

storiesOf("AutoSuggest", module)
    .add("Uncontrolled", () => (
        <AutoSuggest
            {...favoriteAnimalProps}
            onValueChange={action("onValueChange")}
            onInvoked={action("onInvoked")}
            listboxId={uniqueId()}
        >
            <ListboxItem id={uniqueId()} value="Cat">
                Cat
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Dog">
                Dog
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Turtle">
                Turtle
            </ListboxItem>
        </AutoSuggest>
    ))
    .add("Initial value", () => (
        <AutoSuggest
            {...favoriteAnimalProps}
            initialValue="Cat"
            onValueChange={action("onValueChange")}
            onInvoked={action("onInvoked")}
        >
            <ListboxItem id={uniqueId()} value="Cat">
                Cat
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Dog">
                Dog
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Turtle">
                Turtle
            </ListboxItem>
        </AutoSuggest>
    ))
    .add("Controlled", () => (
        <AutoSuggestStateHandler>
            {(
                value: string,
                onValueChange: AutoSuggestProps["onValueChange"]
            ): JSX.Element => (
                <AutoSuggest
                    {...favoriteAnimalProps}
                    value={value}
                    onValueChange={onValueChange}
                >
                    <ListboxItem id={uniqueId()} value="Cat">
                        Cat
                    </ListboxItem>
                    <ListboxItem id={uniqueId()} value="Dog">
                        Dog
                    </ListboxItem>
                    <ListboxItem id={uniqueId()} value="Turtle">
                        Turtle
                    </ListboxItem>
                </AutoSuggest>
            )}
        </AutoSuggestStateHandler>
    ))
    .add("Disabled", () => (
        <AutoSuggest
            {...favoriteAnimalProps}
            onValueChange={action("onValueChange")}
            onInvoked={action("onInvoked")}
            disabled={true}
        >
            <ListboxItem id={uniqueId()} value="Cat">
                Cat
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Dog">
                Dog
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Turtle">
                Turtle
            </ListboxItem>
        </AutoSuggest>
    ))
    .add("on Focus", () => (
        <AutoSuggest
            {...favoriteAnimalProps}
            onValueChange={action("onValueChange")}
            onInvoked={action("onInvoked")}
            menuTrigger={MenuTriggers.onFocus}
        >
            <ListboxItem id={uniqueId()} value="Cat">
                Cat
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Dog">
                Dog
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Turtle">
                Turtle
            </ListboxItem>
        </AutoSuggest>
    ))
    .add("filter", () => (
        <AutoSuggest
            {...favoriteAnimalProps}
            onValueChange={action("onValueChange")}
            onInvoked={action("onInvoked")}
            filterSuggestions={true}
        >
            <ListboxItem id={uniqueId()} value="Cat">
                Cat
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Dog">
                Dog
            </ListboxItem>
            <ListboxItem id={uniqueId()} value="Turtle">
                Turtle
            </ListboxItem>
        </AutoSuggest>
    ));
