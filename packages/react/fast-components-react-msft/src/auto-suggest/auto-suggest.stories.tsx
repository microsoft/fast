import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { uniqueId } from "lodash-es";
import { action } from "@storybook/addon-actions";
import { AutoSuggestOption } from "../auto-suggest-option";
import { AutoSuggest, AutoSuggestProps } from "./";

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

storiesOf("Auto suggest", module)
    .add("Uncontrolled", () => (
        <AutoSuggest
            {...favoriteAnimalProps}
            onValueChange={action("onValueChange")}
            onInvoked={action("onInvoked")}
        >
            <AutoSuggestOption id={uniqueId()} value="Cat" />
            <AutoSuggestOption id={uniqueId()} value="Dog" />
            <AutoSuggestOption id={uniqueId()} value="Turtle" />
        </AutoSuggest>
    ))
    .add("Initial value", () => (
        <AutoSuggest
            {...favoriteAnimalProps}
            initialValue="Cat"
            onValueChange={action("onValueChange")}
            onInvoked={action("onInvoked")}
        >
            <AutoSuggestOption id={uniqueId()} value="Cat" />
            <AutoSuggestOption id={uniqueId()} value="Dog" />
            <AutoSuggestOption id={uniqueId()} value="Turtle" />
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
                    <AutoSuggestOption id={uniqueId()} value="Cat" />
                    <AutoSuggestOption id={uniqueId()} value="Dog" />
                    <AutoSuggestOption id={uniqueId()} value="Turtle" />
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
            <AutoSuggestOption id={uniqueId()} value="Cat" />
            <AutoSuggestOption id={uniqueId()} value="Dog" />
            <AutoSuggestOption id={uniqueId()} value="Turtle" />
        </AutoSuggest>
    ))
    .add("Filter", () => (
        <AutoSuggest
            {...favoriteAnimalProps}
            onValueChange={action("onValueChange")}
            onInvoked={action("onInvoked")}
            filterSuggestions={true}
        >
            <AutoSuggestOption id={uniqueId()} value="Cat" />
            <AutoSuggestOption id={uniqueId()} value="Cheetah" />
            <AutoSuggestOption id={uniqueId()} value="Dog" />
            <AutoSuggestOption id={uniqueId()} value="Elephant" />
            <AutoSuggestOption id={uniqueId()} value="Leopard" />
            <AutoSuggestOption id={uniqueId()} value="Penguin" />
            <AutoSuggestOption id={uniqueId()} value="Turtle" />
        </AutoSuggest>
    ));
