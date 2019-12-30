import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    NeutralButton,
    NeutralButtonProps,
    neutralButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import API from "../api";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const neutralButtonConfig: ComponentViewConfig<NeutralButtonProps> = {
    api: API(React.lazy(() => import("../../.tmp/neutral-button/api"))),
    schema: neutralButtonSchema,
    component: NeutralButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Neutral button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Neutral button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Neutral button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Neutral button",
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
                children: "Neutral button",
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

export default neutralButtonConfig;
