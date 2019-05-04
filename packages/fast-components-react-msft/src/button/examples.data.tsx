import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { Button, ButtonAppearance, ButtonProps } from "./index";
import { ButtonHandledProps as BaseButtonHandledProps } from "@microsoft/fast-components-react-base";
import schema from "./button.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import ReactHTMLElementSchema from "../../app/components/react-html-element.schema.json";
import { ButtonSlot } from "./button";
import { SVGGlyph } from "../../app/components/svg-svg-element";
import svgSchema from "../../app/components/svg-svg-element.schema.json";

const beforeSlotExample: any = {
    id: ReactHTMLElementSchema.id,
    props: {
        slot: ButtonSlot.before,
        children: "<",
    },
};

const afterSlotExample: any = {
    id: ReactHTMLElementSchema.id,
    props: {
        slot: ButtonSlot.after,
        children: ">",
    },
};

const examples: ComponentFactoryExample<ButtonProps> = {
    name: "Button",
    component: Button,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Button",
    },
    data: [
        {
            children: "Default button",
            "data-sketch-symbol": "Button - default",
        } as any,
        {
            appearance: ButtonAppearance.primary,
            children: "Primary button",
            "data-sketch-symbol": "Button - primary",
        },
        {
            appearance: ButtonAppearance.outline,
            children: "Outline button",
            "data-sketch-symbol": "Button - outline",
        },
        {
            appearance: ButtonAppearance.lightweight,
            children: "Lightweight button",
            "data-sketch-symbol": "Button - lightweight",
        },
        {
            appearance: ButtonAppearance.justified,
            children: "Justified button",
        },
        {
            appearance: ButtonAppearance.stealth,
            children: "Stealth button",
        },
        {
            href: "#",
            children: "Anchor",
        },
        {
            href: "#",
            children: ["Before slot only", beforeSlotExample],
        },
        {
            href: "#",
            children: ["After slot only", afterSlotExample],
        },
        {
            href: "#",
            children: [beforeSlotExample, "Both slots", afterSlotExample],
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
            children: "Primary after render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
            appearance: ButtonAppearance.primary,
        },
        {
            children: "Disabled primary after render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
            appearance: ButtonAppearance.primary,
            disabled: true,
        },
        {
            children: "Lightweight after render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
            appearance: ButtonAppearance.lightweight,
        },
        {
            children: "Disabled lightweight after render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
            appearance: ButtonAppearance.lightweight,
            disabled: true,
        },
        {
            children: "Outline after render prop",
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
            appearance: ButtonAppearance.outline,
        },
        {
            children: {
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
        },
        {
            afterContent: {
                id: svgSchema.id,
                props: {
                    path: SVGGlyph.robot,
                },
            },
        },
        {
            href: "#",
            children: [
                beforeSlotExample,
                beforeSlotExample,
                "Mutliple both slots",
                afterSlotExample,
                afterSlotExample,
            ],
        },
        {
            href: "#",
            children: [
                beforeSlotExample,
                beforeSlotExample,
                afterSlotExample,
                afterSlotExample,
            ],
        },
        {
            disabled: true,
            children: "Default button (disabled)",
            "data-sketch-symbol": "Button - default disabled",
        },
        {
            disabled: true,
            appearance: ButtonAppearance.primary,
            children: "Primary button (disabled)",
            "data-sketch-symbol": "Button - primary disabled",
        },
        {
            disabled: true,
            appearance: ButtonAppearance.outline,
            children: "Outline button (disabled)",
            "data-sketch-symbol": "Button - outline disabled",
        },
        {
            disabled: true,
            appearance: ButtonAppearance.lightweight,
            children: "Lightweight button (disabled)",
            "data-sketch-symbol": "Button - lightweight disabled",
        },
        {
            disabled: true,
            appearance: ButtonAppearance.justified,
            children: "Justified button (disabled)",
        },
        {
            disabled: true,
            appearance: ButtonAppearance.stealth,
            children: "Stealth button (disabled)",
        },
        {
            disabled: true,
            href: "#",
            children: "Anchor (disabled)",
        },
    ],
};

export default examples;
