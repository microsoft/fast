import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    LightweightButton,
    LightweightButtonProps,
    lightweightButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import API from "../api";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const lightweightButtonConfig: ComponentViewConfig<LightweightButtonProps> = {
    api: API(React.lazy(() => import("../../.tmp/lightweight-button/api"))),
    schema: lightweightButtonSchema,
    component: LightweightButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Lightweight button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Lightweight button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Lightweight button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Lightweight button",
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
                children: "Lightweight button",
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

export default lightweightButtonConfig;
