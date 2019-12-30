import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    StealthButton,
    StealthButtonProps,
    stealthButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/stealth-button/guidance";
import API from "../api";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const stealthButtonConfig: ComponentViewConfig<StealthButtonProps> = {
    api: API(React.lazy(() => import("../../.tmp/stealth-button/api"))),
    schema: stealthButtonSchema,
    component: StealthButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Stealth button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Stealth button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Stealth button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Stealth button",
                beforeContent: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.user,
                    },
                } as any,
            },
        },
        {
            displayName: "Glyph after text",
            data: {
                children: "Stealth button",
                afterContent: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.arrow,
                    },
                } as any,
            },
        },
    ],
};

export default stealthButtonConfig;
