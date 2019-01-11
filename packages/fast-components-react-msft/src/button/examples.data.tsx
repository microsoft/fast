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

const testGlyph: React.ReactNode = (classname?: string): React.ReactNode => {
    return (
        <svg
            width="13"
            height="16"
            viewBox="0 0 13 16"
            className={classname}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M5 8H4V7H5V8ZM9 8H8V7H9V8ZM13 7V9H12V11.5C12 11.7083 11.9609 11.9036 11.8828 12.0859C11.8047 12.2682 11.6979 12.4271 11.5625 12.5625C11.4271 12.6979 11.2682 12.8047 11.0859 12.8828C10.9036 12.9609 10.7083 13 10.5 13H8.4375L5 15.9375V13H2.5C2.29167 13 2.09635 12.9609 1.91406 12.8828C1.73177 12.8047 1.57292 12.6979 1.4375 12.5625C1.30208 12.4271 1.19531 12.2682 1.11719 12.0859C1.03906 11.9036 1 11.7083 1 11.5V9H0V7H1V5.5C1 5.29167 1.03906 5.09635 1.11719 4.91406C1.19531 4.73177 1.30208 4.57292 1.4375 4.4375C1.57292 4.30208 1.73177 4.19531 1.91406 4.11719C2.09635 4.03906 2.29167 4 2.5 4H6V2.36719C5.84896 2.27865 5.72656 2.15625 5.63281 2C5.54427 1.84375 5.5 1.67708 5.5 1.5C5.5 1.35938 5.52604 1.22917 5.57812 1.10938C5.63021 0.989583 5.70052 0.885417 5.78906 0.796875C5.88281 0.703125 5.98958 0.630208 6.10938 0.578125C6.22917 0.526042 6.35938 0.5 6.5 0.5C6.64062 0.5 6.77083 0.526042 6.89062 0.578125C7.01042 0.630208 7.11458 0.703125 7.20312 0.796875C7.29688 0.885417 7.36979 0.989583 7.42188 1.10938C7.47396 1.22917 7.5 1.35938 7.5 1.5C7.5 1.67708 7.45312 1.84375 7.35938 2C7.27083 2.15625 7.15104 2.27865 7 2.36719V4H10.5C10.7083 4 10.9036 4.03906 11.0859 4.11719C11.2682 4.19531 11.4271 4.30208 11.5625 4.4375C11.6979 4.57292 11.8047 4.73177 11.8828 4.91406C11.9609 5.09635 12 5.29167 12 5.5V7H13ZM11 5.5C11 5.36458 10.9505 5.2474 10.8516 5.14844C10.7526 5.04948 10.6354 5 10.5 5H2.5C2.36458 5 2.2474 5.04948 2.14844 5.14844C2.04948 5.2474 2 5.36458 2 5.5V11.5C2 11.6354 2.04948 11.7526 2.14844 11.8516C2.2474 11.9505 2.36458 12 2.5 12H6V13.7656L8.0625 12H10.5C10.6354 12 10.7526 11.9505 10.8516 11.8516C10.9505 11.7526 11 11.6354 11 11.5V5.5ZM4.35156 9.10938C4.63802 9.39583 4.96615 9.61719 5.33594 9.77344C5.70573 9.92448 6.09375 10 6.5 10C6.90625 10 7.29427 9.92448 7.66406 9.77344C8.03385 9.61719 8.36198 9.39583 8.64844 9.10938L9.35156 9.82031C8.97135 10.2005 8.53385 10.4922 8.03906 10.6953C7.54948 10.8984 7.03646 11 6.5 11C5.96354 11 5.44792 10.8984 4.95312 10.6953C4.46354 10.4922 4.02865 10.2005 3.64844 9.82031L4.35156 9.10938Z" />
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
            beforeContent: testGlyph,
            children: "Mutliple both render props",
            afterContent: testGlyph,
        },
        {
            beforeContent: testGlyph,
            children: "Before render prop",
        },
        {
            children: "After render prop",
            afterContent: testGlyph,
        },
        {
            children: "Disabled after render prop",
            afterContent: testGlyph,
            disabled: true,
        },
        {
            children: "Primary after render prop",
            afterContent: testGlyph,
            appearance: ButtonAppearance.primary,
        },
        {
            children: "Disabled primary after render prop",
            afterContent: testGlyph,
            appearance: ButtonAppearance.primary,
            disabled: true,
        },
        {
            children: "Lightweight after render prop",
            afterContent: testGlyph,
            appearance: ButtonAppearance.lightweight,
        },
        {
            children: "Disabled lightweight after render prop",
            afterContent: testGlyph,
            appearance: ButtonAppearance.lightweight,
            disabled: true,
        },
        {
            children: "Outline after render prop",
            afterContent: testGlyph,
            appearance: ButtonAppearance.outline,
        },
        {
            beforeContent: testGlyph,
        },
        {
            afterContent: testGlyph,
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
