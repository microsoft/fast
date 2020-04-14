import { storiesOf } from "@storybook/react";
import React from "react";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { AccentButton } from "./";

storiesOf("Accent button", module)
    .add("Default", () => <AccentButton>Accent button</AccentButton>)
    .add("Anchor", () => (
        <AccentButton
            href="#"
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Anchor button
        </AccentButton>
    ))
    .add("Before content", () => (
        <AccentButton beforeContent={glyphFactory(SVGGlyph.download)}>
            With before content
        </AccentButton>
    ))
    .add("After content", () => (
        <AccentButton afterContent={glyphFactory(SVGGlyph.robot)}>
            With after content
        </AccentButton>
    ))
    .add("Only before content", () => (
        <AccentButton beforeContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Only after content", () => (
        <AccentButton afterContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Disabled button", () => (
        <AccentButton
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled accent button
        </AccentButton>
    ))
    .add("Disabled anchor", () => (
        <AccentButton
            href={"#"}
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled accent anchor button
        </AccentButton>
    ));
