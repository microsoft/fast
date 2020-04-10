import { storiesOf } from "@storybook/react";
import React from "react";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { OutlineButton } from "./";

storiesOf("Outline button", module)
    .add("Default", () => <OutlineButton>Outline button</OutlineButton>)
    .add("Anchor", () => (
        <OutlineButton
            href="#"
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Anchor button
        </OutlineButton>
    ))
    .add("Before content", () => (
        <OutlineButton beforeContent={glyphFactory(SVGGlyph.download)}>
            With before content
        </OutlineButton>
    ))
    .add("After content", () => (
        <OutlineButton afterContent={glyphFactory(SVGGlyph.robot)}>
            With after content
        </OutlineButton>
    ))
    .add("Only before content", () => (
        <OutlineButton beforeContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Only after content", () => (
        <OutlineButton afterContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Disabled", () => (
        <OutlineButton
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled outline button
        </OutlineButton>
    ))
    .add("Disabled anchor", () => (
        <OutlineButton
            href={"#"}
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled outline anchor button
        </OutlineButton>
    ));
