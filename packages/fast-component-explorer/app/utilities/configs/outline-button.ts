import { ComponentViewConfig } from "./data.props";
import {
    OutlineButton,
    OutlineButtonProps,
    outlineButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const outlineButtonConfig: ComponentViewConfig<OutlineButtonProps> = {
    schema: outlineButtonSchema,
    component: OutlineButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Default outline button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Anchor outline button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Disabled outline button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Glyph before text outline button",
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
                children: "Glyph after text outline button",
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
