import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { StealthButton, StealthButtonProps, stealthButtonSchema } from "./index";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { SVGGlyph } from "../../app/components/svg-svg-element";
import svgSchema from "../../app/components/svg-svg-element.schema";

const examples: ComponentFactoryExample<StealthButtonProps> = {
    name: "Stealth button",
    component: StealthButton,
    schema: stealthButtonSchema,
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
            } as any,
            children: "Mutliple both render props",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            } as any,
        },
        {
            beforeContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            } as any,
            children: "Before render prop",
        },
        {
            children: "After render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            } as any,
        },
        {
            children: "Disabled after render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            } as any,
            disabled: true,
        },
        {
            beforeContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            } as any,
        },
        {
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            } as any,
        },
    ],
};

export default examples;
