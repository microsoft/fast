import {
    StealthButton,
    StealthButtonProps,
    stealthButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import { ComponentViewConfig } from "./data.props";

const stealthButtonConfig: ComponentViewConfig<StealthButtonProps> = {
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
