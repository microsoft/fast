import { storiesOf } from "@storybook/react";
import React from "react";
import { Divider } from "../divider";
import { ContextMenuItem } from "./";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import API from "./.tmp/API.md";

storiesOf("Context menu item", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => <ContextMenuItem>Default menu item</ContextMenuItem>)
    .add("With glyph", () => (
        <ContextMenuItem before={glyphFactory(SVGGlyph.download)()}>
            Menu item with glyph
        </ContextMenuItem>
    ))
    .add("Disabled", () => (
        <ContextMenuItem disabled={true}>Disabled menu item</ContextMenuItem>
    ));
