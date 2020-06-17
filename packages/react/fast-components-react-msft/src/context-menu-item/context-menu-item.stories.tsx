import { storiesOf } from "@storybook/react";
import React from "react";
import { glyphFactory, SVGGlyph } from "../../assets/svg-element";
import { ContextMenuItem } from "./";

storiesOf("Context menu item", module)
    .add("Default", () => <ContextMenuItem>Default menu item</ContextMenuItem>)
    .add("With before glyph", () => (
        <ContextMenuItem before={glyphFactory(SVGGlyph.download)()}>
            Menu item with before glyph
        </ContextMenuItem>
    ))
    .add("With after glyph", () => (
        <ContextMenuItem after={glyphFactory(SVGGlyph.user)()}>
            Menu item with after glyph
        </ContextMenuItem>
    ))
    .add("With before and after glyph", () => (
        <ContextMenuItem
            before={glyphFactory(SVGGlyph.download)()}
            after={glyphFactory(SVGGlyph.user)()}
        >
            Menu item with before and after glyph
        </ContextMenuItem>
    ))
    .add("Disabled", () => (
        <ContextMenuItem disabled={true}>Disabled menu item</ContextMenuItem>
    ));
