import * as React from "react";
import { ActionTrigger, ActionTriggerAppearance, ActionTriggerProps } from "./index";
import schema from "./action-trigger.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const testDestination: string = "https://www.microsoft.com/en-us/";

const testGlyph: any = (classname: string): React.ReactNode => {
    return (
        <svg
            className={classname}
            width="7"
            height="12"
            viewBox="0 0 7 12"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M0.0175781 11.4551L5.4668 6L0.0175781 0.544922L0.544922 0.0175781L6.5332 6L0.544922 11.9824L0.0175781 11.4551Z" />
        </svg>
    );
};

export default {
    name: "Action trigger",
    component: ActionTrigger,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Action Trigger",
        appearance: ActionTriggerAppearance.primary,
        href: testDestination,
        glyph: testGlyph,
    },
    data: [
        {
            appearance: ActionTriggerAppearance.primary,
            children: "Primary action trigger",
            href: testDestination,
            glyph: testGlyph,
            "data-sketch-symbol": "Action trigger - primary",
        } as any,
        {
            appearance: ActionTriggerAppearance.lightweight,
            children: "Lightweight action trigger",
            href: testDestination,
            glyph: testGlyph,
            "data-sketch-symbol": "Action trigger - lightweight",
        },
        {
            appearance: ActionTriggerAppearance.justified,
            children: "Justified action trigger",
            href: testDestination,
            glyph: testGlyph,
            "data-sketch-symbol": "Action trigger - justified",
        },
        {
            appearance: ActionTriggerAppearance.outline,
            children: "Outlined action trigger",
            href: testDestination,
            glyph: testGlyph,
            "data-sketch-symbol": "Action trigger - outlined",
        },
    ],
} as ComponentFactoryExample<ActionTriggerProps>;
