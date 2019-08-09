import { ComponentViewConfig } from "./data.props";
import {
    StealthButton,
    StealthButtonProps,
    stealthButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const stealthButtonConfig: ComponentViewConfig<StealthButtonProps> = {
    schema: stealthButtonSchema,
    component: StealthButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Default stealth button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Anchor stealth button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Disabled stealth button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Glyph before text stealth button",
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
                children: "Glyph after text stealth button",
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
