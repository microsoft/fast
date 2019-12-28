import { storiesOf } from "@storybook/react";
import React from "react";
import { SelectOption } from "./";
import { uniqueId } from "lodash-es";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import API from "./.tmp/API.md";

storiesOf("Select option", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => (
        <SelectOption id={uniqueId()} value="Default" displayString="Default" />
    ))
    .add("Glpyh", () => (
        <SelectOption
            id={uniqueId()}
            value="Default"
            displayString="With glyph"
            glyph={glyphFactory(SVGGlyph.robot)}
        />
    ))
    .add("Disabled", () => (
        <SelectOption
            id={uniqueId()}
            value="Default"
            displayString="Disabled"
            glyph={glyphFactory(SVGGlyph.robot)}
            disabled={true}
        />
    ));
