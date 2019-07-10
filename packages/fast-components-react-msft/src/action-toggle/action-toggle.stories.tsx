import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { ActionToggle, ActionToggleAppearance, ActionToggleProps } from "./";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { action } from "@storybook/addon-actions";
import { ActionToggleHandledProps } from "./action-toggle.props";

/**
 * Simple state manager to track and update checked properties
 */
function ActionToggleStateHandler(props: {
    children: (
        checked: boolean,
        onChange: ActionToggleHandledProps["onToggle"]
    ) => JSX.Element;
}): JSX.Element {
    const [checked, setChecked]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState(true);

    function handleChange(
        e: React.MouseEvent<HTMLElement>,
        instanceProps: ActionToggleProps
    ): void {
        setChecked(!instanceProps.selected);
        action("onToggle")(e, instanceProps);
    }

    return props.children(checked, handleChange);
}
const playPauseProps: Pick<
    ActionToggleHandledProps,
    "selectedLabel" | "unselectedLabel" | "selectedGlyph" | "unselectedGlyph" | "onToggle"
> = {
    selectedLabel: "play",
    unselectedLabel: "pause",
    selectedGlyph: glyphFactory(SVGGlyph.play),
    unselectedGlyph: glyphFactory(SVGGlyph.pause),
    onToggle: action("onToggle"),
};

storiesOf("Action toggle", module)
    .add("Uncontrolled", () => <ActionToggle {...playPauseProps} />)
    .add("Controlled", () => {
        return (
            <ActionToggleStateHandler>
                {(
                    selected: boolean,
                    onToggle: ActionToggleHandledProps["onToggle"]
                ): JSX.Element => (
                    <ActionToggle
                        {...playPauseProps}
                        selected={selected}
                        onToggle={onToggle}
                    />
                )}
            </ActionToggleStateHandler>
        );
    })
    .add("Primary", () => (
        <ActionToggle appearance={ActionToggleAppearance.primary} {...playPauseProps} />
    ))
    .add("Lightweight", () => (
        <ActionToggle
            appearance={ActionToggleAppearance.lightweight}
            {...playPauseProps}
        />
    ))
    .add("Outline", () => (
        <ActionToggle appearance={ActionToggleAppearance.outline} {...playPauseProps} />
    ))
    .add("Stealth", () => (
        <ActionToggle appearance={ActionToggleAppearance.stealth} {...playPauseProps} />
    ))
    .add("Justified", () => (
        <ActionToggle appearance={ActionToggleAppearance.justified} {...playPauseProps} />
    ));
