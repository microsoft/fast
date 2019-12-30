import { ComponentViewConfig } from "./data.props";
import {
    AccentButton,
    AccentButtonProps,
    accentButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import API from "../../.tmp/accent-button/api";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const accentButtonConfig: ComponentViewConfig<AccentButtonProps> = {
    api: API,
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
