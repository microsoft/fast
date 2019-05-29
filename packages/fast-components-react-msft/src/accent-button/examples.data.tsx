import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { AccentButton, AccentButtonProps } from "./index";
import schema from "./accent-button.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { SVGGlyph } from "../../app/components/svg-svg-element";
import svgSchema from "../../app/components/svg-svg-element.schema.json";

const examples: ComponentFactoryExample<AccentButtonProps> = {
    name: "Accent button",
    component: AccentButton,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Button",
    },
    data: [
        {
            children: "Default button",
        },
        {
            href: "#",
            children: "Anchor",
        },
        {
            beforeContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
            children: "Mutliple both render props",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
        },
        {
            beforeContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
            children: "Before render prop",
        },
        {
            children: "After render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
        },
        {
            children: "Disabled after render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
            disabled: true,
        },
        {
            beforeContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
        },
        {
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
        },
    ],
};

export default examples;
