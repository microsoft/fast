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
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M16 2.61719C16 2.96094 15.9349 3.29427 15.8047 3.61719C15.6745 3.9401 15.4844 4.22656 15.2344 4.47656L4.94531 14.7656L0 16L1.23438 11.0547L11.5234 0.765625C11.7734 0.515625 12.0599 0.325521 12.3828 0.195312C12.7057 0.0651042 13.0391 0 13.3828 0C13.7422 0 14.0807 0.0703125 14.3984 0.210938C14.7161 0.346354 14.9922 0.533854 15.2266 0.773438C15.4661 1.00781 15.6536 1.28385 15.7891 1.60156C15.9297 1.91927 16 2.25781 16 2.61719ZM2.54688 11.1562C3.09896 11.3385 3.57292 11.6302 3.96875 12.0312C4.36979 12.4271 4.66146 12.901 4.84375 13.4531L13.2891 5L11 2.71094L2.54688 11.1562ZM1.375 14.625L3.94531 13.9844C3.89323 13.7448 3.80729 13.5182 3.6875 13.3047C3.57292 13.0911 3.43229 12.901 3.26562 12.7344C3.09896 12.5677 2.90885 12.4271 2.69531 12.3125C2.48177 12.1927 2.25521 12.1068 2.01562 12.0547L1.375 14.625ZM14 4.28906C14.1302 4.15885 14.2552 4.03646 14.375 3.92188C14.4948 3.80729 14.6016 3.6875 14.6953 3.5625C14.7891 3.43229 14.862 3.29427 14.9141 3.14844C14.9714 2.9974 15 2.82292 15 2.625C15 2.40104 14.9557 2.19271 14.8672 2C14.7839 1.80208 14.6667 1.63021 14.5156 1.48438C14.3698 1.33333 14.1979 1.21615 14 1.13281C13.8073 1.04427 13.599 1 13.375 1C13.1771 1 13.0026 1.02865 12.8516 1.08594C12.7057 1.13802 12.5677 1.21094 12.4375 1.30469C12.3125 1.39844 12.1927 1.50521 12.0781 1.625C11.9635 1.74479 11.8411 1.86979 11.7109 2L14 4.28906Z" />
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
