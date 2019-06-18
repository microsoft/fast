import React from "react";
import { SelectOption, SelectOptionProps, selectOptionSchema } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Documentation from "./.tmp/documentation";
import { SVGGlyph } from "../../app/components/svg-svg-element";
import svgSchema from "../../app/components/svg-svg-element.schema";

export default {
    name: "Select option",
    component: SelectOption,
    schema: selectOptionSchema as any,
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
