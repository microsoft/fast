import * as React from "react";
import { ListboxItem, ListboxItemProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./listbox-item.schema.json";
import Documentation from "./.tmp/documentation";
import { SVGGlyph } from "../../app/components/svg-svg-element";
import svgSchema from "../../app/components/svg-svg-element.schema.json";

export default {
    name: "Listbox item",
    component: ListboxItem,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "listbox item",
        glyph: {
            id: svgSchema.id,
            props: {
                path: SVGGlyph.arrow,
            },
        } as any,
    },
    data: [
        {
            children: "listbox item",
        },
        {
            children: "listbox item",
            glyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.arrow,
                },
            } as any,
        },
        {
            children: "listbox item",
            disabled: true,
        },
        {
            children: "listbox item",
            disabled: true,
            glyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.arrow,
                },
            } as any,
        },
    ],
} as ComponentFactoryExample<ListboxItemProps>;
