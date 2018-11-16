import * as React from "react";
import { ActionTrigger, ActionTriggerAppearance, ActionTriggerProps } from "./index";
import schema from "./action-trigger.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const testDestination: string = "https://www.microsoft.com/en-us/";

export default {
    name: "Action trigger",
    component: ActionTrigger,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Action Trigger",
        appearance: ActionTriggerAppearance.primary,
        href: testDestination,
        glyph: (classname?: string): React.ReactNode => {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-4014.4 1616.998 4.4 8"
                    className={classname}
                >
                    <g transform="translate(-4128 1600.698)">
                        <path
                            d="M140.6,23.9l3.7-3.6-3.7-3.6.4-.4,4,4-4,4Z"
                            transform="translate(-27)"
                        />
                    </g>
                </svg>
            );
        },
    },
    data: [
        {
            appearance: ActionTriggerAppearance.primary,
            children: "Primary action trigger",
            href: testDestination,
            "data-sketch-symbol": "Action trigger - primary",
        } as any, // TODO https://github.com/Microsoft/TypeScript/issues/6579
        {
            appearance: ActionTriggerAppearance.lightweight,
            children: "Lightweight action trigger",
            href: testDestination,
            "data-sketch-symbol": "Action trigger - lightweight",
        },
        {
            appearance: ActionTriggerAppearance.justified,
            children: "Justified action trigger",
            href: testDestination,
            "data-sketch-symbol": "Action trigger - justified",
        },
        {
            appearance: ActionTriggerAppearance.outline,
            children: "Outlined action trigger",
            href: testDestination,
            "data-sketch-symbol": "Action trigger - outlined",
        },
    ],
} as ComponentFactoryExample<ActionTriggerProps>;
