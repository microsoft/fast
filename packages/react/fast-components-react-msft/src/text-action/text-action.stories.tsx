import { storiesOf } from "@storybook/react";
import React from "react";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { Button } from "../button";
import { TextAction, TextActionAppearance, TextActionButtonPosition } from "./";

function textActionButton(className?: string, disabled?: boolean): React.ReactNode {
    return (
        <Button
            beforeContent={glyphFactory(SVGGlyph.arrow)}
            className={className}
            disabled={disabled}
        />
    );
}
storiesOf("Text action", module)
    .add("Default", () => <TextAction />)
    .add("Filled", () => (
        <TextAction button={textActionButton} appearance={TextActionAppearance.filled} />
    ))
    .add("Outline", () => (
        <TextAction button={textActionButton} appearance={TextActionAppearance.outline} />
    ))
    .add("With placeholder", () => <TextAction placeholder="Placeholder" />)
    .add("With button", () => <TextAction button={textActionButton} />)
    .add("With before glyph ", () => (
        <TextAction button={textActionButton} beforeGlyph={glyphFactory(SVGGlyph.user)} />
    ))
    .add("With after glyph ", () => (
        <TextAction button={textActionButton} afterGlyph={glyphFactory(SVGGlyph.user)} />
    ))
    .add("With default value ", () => (
        <TextAction button={textActionButton} defaultValue="default value" />
    ))
    .add("Disabled ", () => <TextAction button={textActionButton} disabled={true} />)
    .add("Before button position", () => (
        <TextAction
            button={textActionButton}
            buttonPosition={TextActionButtonPosition.before}
        />
    ))
    .add("After button position", () => (
        <TextAction
            button={textActionButton}
            buttonPosition={TextActionButtonPosition.after}
        />
    ));
