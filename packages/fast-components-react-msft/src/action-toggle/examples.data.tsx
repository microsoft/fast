import * as React from "react";
import { ActionToggle, ActionToggleAppearance, ActionToggleProps } from "./index";
import schema from "./action-toggle.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const testDestination: string = "https://www.microsoft.com/en-us/";

export default {
    name: "Action toggle",
    component: ActionToggle,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        appearance: ActionToggleAppearance.primary,
        selectedText: "Pause",
        unselectedText: "Play",
        selectedGlyph: (classname?: string): React.ReactNode => {
            return (
                <svg
                    className={classname}
                    width="6"
                    height="12"
                    viewBox="0 0 6 12"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 0H1V12H0V0ZM6 0V12H5V0H6Z" />
                </svg>
            );
        },
        unselectedGlyph: (classname?: string): React.ReactNode => {
            return (
                <svg
                    className={classname}
                    width="10"
                    height="14"
                    viewBox="0 0 10 14"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M10 7L0 14V0L10 7ZM1 12.0781L8.25781 7L1 1.92188V12.0781Z" />
                </svg>
            );
        },
    },
    data: [
        {
            appearance: ActionToggleAppearance.primary,
            "data-sketch-symbol": "Action toggle - primary",
        } as any,
        {
            appearance: ActionToggleAppearance.lightweight,
            "data-sketch-symbol": "Action toggle - lightweight",
        },
        {
            appearance: ActionToggleAppearance.justified,
            "data-sketch-symbol": "Action toggle - justified",
        },
        {
            appearance: ActionToggleAppearance.outline,
            "data-sketch-symbol": "Action toggle - outlined",
        },
    ],
} as ComponentFactoryExample<ActionToggleProps>;
