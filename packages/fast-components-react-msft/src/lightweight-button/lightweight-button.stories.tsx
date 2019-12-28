import { storiesOf } from "@storybook/react";
import React from "react";
import { LightweightButton } from "./";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import API from "./.tmp/API.md";

storiesOf("Lightweight button", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => <LightweightButton>Lightweight button</LightweightButton>)
    .add("Anchor", () => (
        <LightweightButton
            href="#"
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Anchor button
        </LightweightButton>
    ))
    .add("Before content", () => (
        <LightweightButton beforeContent={glyphFactory(SVGGlyph.download)}>
            With before content
        </LightweightButton>
    ))
    .add("After content", () => (
        <LightweightButton afterContent={glyphFactory(SVGGlyph.robot)}>
            With after content
        </LightweightButton>
    ))
    .add("Only before content", () => (
        <LightweightButton beforeContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Only after content", () => (
        <LightweightButton afterContent={glyphFactory(SVGGlyph.robot)} />
    ))
    .add("Disabled", () => (
        <LightweightButton
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled lightweight button
        </LightweightButton>
    ))
    .add("Disabled anchor", () => (
        <LightweightButton
            href={"#"}
            disabled={true}
            beforeContent={glyphFactory(SVGGlyph.download)}
            afterContent={glyphFactory(SVGGlyph.user)}
        >
            Disabled lightweight anchor button
        </LightweightButton>
    ));
