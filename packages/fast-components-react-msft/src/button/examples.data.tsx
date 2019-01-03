import * as React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { Button, ButtonAppearance, ButtonProps } from "./index";
import { ButtonHandledProps as BaseButtonHandledProps } from "@microsoft/fast-components-react-base";
import schema from "./button.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import ReactHTMLElementSchema from "../../app/components/react-html-element.schema.json";
import { ButtonSlot } from "./button";

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

const svgProperties: any = {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
};

const testGlyph: React.ReactNode = (classname?: string): React.ReactNode => {
    return (
        <svg {...svgProperties} className={classname}>
            <path d="M5.85547 13.8535L5.14648 13.1445L10.291 8L5.14648 2.85547L5.85547 2.14648L11.709 8L5.85547 13.8535Z" />
        </svg>
    );
};

export default {
    name: "Button",
    component: Button,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Button",
    },
    data: [
        {
            children: "Secondary button",
            "data-sketch-symbol": "Button - secondary",
        },
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
            beforeGlyph: testGlyph,
            children: "Mutliple both render props slots",
            afterGlyph: testGlyph,
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
            children: "Secondary button (disabled)",
            "data-sketch-symbol": "Button - secondary disabled",
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
            href: "#",
            children: "Anchor (disabled)",
        },
    ],
} as ComponentFactoryExample<ButtonProps>;
