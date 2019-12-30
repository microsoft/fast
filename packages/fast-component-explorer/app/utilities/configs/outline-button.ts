import { ComponentViewConfig } from "./data.props";
import {
    OutlineButton,
    OutlineButtonProps,
    outlineButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/outline-button/guidance";
import API from "../../.tmp/outline-button/api";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const outlineButtonConfig: ComponentViewConfig<OutlineButtonProps> = {
    api: API,
    schema: outlineButtonSchema,
    component: OutlineButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Outline button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Outline button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Outline button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Outline button",
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
                children: "Outline button",
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

export default outlineButtonConfig;
