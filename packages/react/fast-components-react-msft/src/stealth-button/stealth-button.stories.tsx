import { storiesOf } from "@storybook/react";
import React from "react";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { StealthButton } from "./";

storiesOf("Stealth button", module)
    .add("Default", () => <StealthButton>Stealth button</StealthButton>)
    .add("Anchor", () => (
        <StealthButton
            href="#"
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Anchor button
        </StealthButton>
    ))
    .add("Before content", () => (
        <StealthButton beforeContent={glyphFactory(SVGGlyph.download)}>
            With before content
        </StealthButton>
    ))
    .add("After content", () => (
        <StealthButton afterContent={glyphFactory(SVGGlyph.robot)}>
            With after content
        </StealthButton>
    ))
    .add("Only before content", () => (
        <StealthButton beforeContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Only after content", () => (
        <StealthButton afterContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Disabled", () => (
        <StealthButton
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled stealth button
        </StealthButton>
    ))
    .add("Disabled anchor", () => (
        <StealthButton
            href={"#"}
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled stealth anchor button
        </StealthButton>
    ));
