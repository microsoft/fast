import React from "react";
import { SelectOption, SelectOptionProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./select-option.schema.json";
import Documentation from "./.tmp/documentation";
import { SVGGlyph } from "../../app/components/svg-svg-element";
import svgSchema from "../../app/components/svg-svg-element.schema.json";

export default {
    name: "Select option",
    component: SelectOption,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        displayString: "Select option",
        glyph: {
            id: svgSchema.id,
            props: {
                path: SVGGlyph.user,
            },
        } as any,
    },
    data: [
        {
            displayString: "Select option",
        },
        {
            displayString: "Select option",
            glyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.user,
                },
            } as any,
        },
        {
            displayString: "Select option",
            disabled: true,
        },
        {
            displayString: "Select option",
            disabled: true,
            glyph: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.user,
                },
            } as any,
        },
        {
            children: "Hello world",
        },
    ],
} as ComponentFactoryExample<SelectOptionProps>;
