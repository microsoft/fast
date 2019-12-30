import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { ActionTrigger, ActionTriggerAppearance } from "./";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { action } from "@storybook/addon-actions";
import API from "./API.md";

storiesOf("Action trigger", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
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
    .add("Lightweight", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.lightweight}
            onClick={action("onClick")}
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
    .add("Primary", () => (
        <ActionTrigger
            glyph={glyphFactory(SVGGlyph.download)}
            appearance={ActionTriggerAppearance.primary}
            onClick={action("onClick")}
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
    ));
