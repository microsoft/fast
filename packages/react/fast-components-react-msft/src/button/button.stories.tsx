import { storiesOf } from "@storybook/react";
import React from "react";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { Button, ButtonAppearance } from "./";

storiesOf("Button", module)
    .add("Default", () => <Button>Button</Button>)
    .add("Anchor", () => (
        <Button
            href="#"
            beforeContent={glyphFactory(SVGGlyph.user)}
            afterContent={glyphFactory(SVGGlyph.download)}
        >
            Anchor button
        </Button>
    ))
    .add("Anchor - disabled", () => (
        <Button href="#" disabled={true}>
            Anchor button
        </Button>
    ))
    .add("Primary", () => (
        <Button appearance={ButtonAppearance.primary}>Primary Button</Button>
    ))
    .add("Primary Anchor", () => (
        <Button
            appearance={ButtonAppearance.primary}
            href="#"
            beforeContent={glyphFactory(SVGGlyph.user)}
            afterContent={glyphFactory(SVGGlyph.download)}
        >
            Primary Anchor
        </Button>
    ))
    .add("Primary - disabled", () => (
        <Button appearance={ButtonAppearance.primary} disabled={true}>
            Primary Button
        </Button>
    ))
    .add("Primary Anchor - disabled", () => (
        <Button
            appearance={ButtonAppearance.primary}
            href="#"
            beforeContent={glyphFactory(SVGGlyph.user)}
            afterContent={glyphFactory(SVGGlyph.download)}
            disabled={true}
        >
            Primary Anchor
        </Button>
    ))
    .add("Outline", () => (
        <Button appearance={ButtonAppearance.outline}>Outline Button</Button>
    ))
    .add("Outline - disabled", () => (
        <Button appearance={ButtonAppearance.outline} disabled={true}>
            Outline Button
        </Button>
    ))
    .add("Lightweight", () => (
        <Button appearance={ButtonAppearance.lightweight}>Lightweight Button</Button>
    ))
    .add("Lightweight - disabled", () => (
        <Button appearance={ButtonAppearance.lightweight} disabled={true}>
            Lightweight Button
        </Button>
    ))
    .add("Lightweight Anchor", () => (
        <Button
            appearance={ButtonAppearance.lightweight}
            href="#"
            beforeContent={glyphFactory(SVGGlyph.user)}
            afterContent={glyphFactory(SVGGlyph.download)}
        >
            Lightweight Button
        </Button>
    ))
    .add("Lightweight Anchor - disabled", () => (
        <Button appearance={ButtonAppearance.lightweight} href="#" disabled={true}>
            Lightweight Button
        </Button>
    ))
    .add("Justified", () => (
        <Button appearance={ButtonAppearance.justified}>Justified Button</Button>
    ))
    .add("Justified - disabled", () => (
        <Button appearance={ButtonAppearance.justified} disabled={true}>
            Justified Button
        </Button>
    ))
    .add("Stealth", () => (
        <Button appearance={ButtonAppearance.stealth}>Stealth Button</Button>
    ))
    .add("Stealth - disabled", () => (
        <Button appearance={ButtonAppearance.stealth} disabled={true}>
            Stealth Button
        </Button>
    ))
    .add("Before content", () => (
        <Button beforeContent={glyphFactory(SVGGlyph.user)}>Login</Button>
    ))
    .add("After content", () => (
        <Button afterContent={glyphFactory(SVGGlyph.download)}>Download</Button>
    ))
    .add("Before and after content - disabled", () => (
        <Button
            beforeContent={glyphFactory(SVGGlyph.user)}
            afterContent={glyphFactory(SVGGlyph.download)}
            disabled={true}
        >
            Do stuff
        </Button>
    ));
