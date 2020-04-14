import { storiesOf } from "@storybook/react";
import React from "react";
import { action } from "@storybook/addon-actions";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { ActionTrigger, ActionTriggerAppearance } from "./";

storiesOf("Action trigger", module)
    .add("Default", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            onClick={action("onClick")}
        >
            Download
        </ActionTrigger>
    ))
    .add("Icon only", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            onClick={action("onClick")}
        />
    ))
    .add("Justified", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.justified}
            onClick={action("onClick")}
        >
            Download
        </ActionTrigger>
    ))
    .add("Justified Anchor", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.justified}
            onClick={action("onClick")}
            href="#"
        >
            Download
        </ActionTrigger>
    ))
    .add("Lightweight", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.lightweight}
            onClick={action("onClick")}
        >
            Download
        </ActionTrigger>
    ))
    .add("Lightweight Anchor", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.lightweight}
            onClick={action("onClick")}
            href="#"
        >
            Download
        </ActionTrigger>
    ))
    .add("Outline", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.outline}
            onClick={action("onClick")}
        >
            Download
        </ActionTrigger>
    ))
    .add("Outline Anchor", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.outline}
            onClick={action("onClick")}
            href="#"
        >
            Download
        </ActionTrigger>
    ))
    .add("Primary", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.primary}
            onClick={action("onClick")}
        >
            Download
        </ActionTrigger>
    ))
    .add("Primary Anchor", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.primary}
            onClick={action("onClick")}
            href="#"
        >
            Download
        </ActionTrigger>
    ))
    .add("Primary Anchor Disabled", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.primary}
            onClick={action("onClick")}
            disabled={true}
            href="#"
        >
            Download
        </ActionTrigger>
    ))
    .add("Stealth", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.stealth}
            onClick={action("onClick")}
        >
            Download
        </ActionTrigger>
    ))
    .add("Stealth Anchor", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.stealth}
            onClick={action("onClick")}
            href="#"
        >
            Download
        </ActionTrigger>
    ));
