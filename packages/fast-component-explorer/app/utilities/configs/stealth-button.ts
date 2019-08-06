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
                children: "Stealth button",
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
            displayName: "Before content stealth button",
            data: {
                children: "Disabled stealth button",
                beforeContent: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.user,
                    },
                } as any,
            },
        },
        {
            displayName: "After content stealth button",
            data: {
                children: "Disabled stealth button",
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
