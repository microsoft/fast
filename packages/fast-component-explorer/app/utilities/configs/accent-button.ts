import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    AccentButton,
    AccentButtonProps,
    accentButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import API from "../api";

const Foo: any = React.lazy(() => import("../../.tmp/accent-button/api"));

const accentButtonConfig: ComponentViewConfig<AccentButtonProps> = {
    api: API(Foo),
    schema: accentButtonSchema,
    component: AccentButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Accent button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Accent button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Accent button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Accent button",
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
                children: "Accent button",
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

export default accentButtonConfig;
