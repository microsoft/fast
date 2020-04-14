import { storiesOf } from "@storybook/react";
import React from "react";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { NeutralButton } from "./";

storiesOf("Neutral button", module)
    .add("Default", () => <NeutralButton>Neutral button</NeutralButton>)
    .add("Anchor", () => (
        <NeutralButton
            href="#"
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Anchor button
        </NeutralButton>
    ))
    .add("Before content", () => (
        <NeutralButton beforeContent={glyphFactory(SVGGlyph.download)}>
            With before content
        </NeutralButton>
    ))
    .add("After content", () => (
        <NeutralButton afterContent={glyphFactory(SVGGlyph.robot)}>
            With after content
        </NeutralButton>
    ))
    .add("Only before content", () => (
        <NeutralButton beforeContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Only after content", () => (
        <NeutralButton afterContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Disabled", () => (
        <NeutralButton
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled neutral button
        </NeutralButton>
    ))
    .add("Disabled anchor", () => (
        <NeutralButton
            href={"#"}
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled neutral anchor button
        </NeutralButton>
    ));
