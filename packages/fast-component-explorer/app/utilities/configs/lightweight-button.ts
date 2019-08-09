import { ComponentViewConfig } from "./data.props";
import {
    LightweightButton,
    LightweightButtonProps,
    lightweightButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const lightweightButtonConfig: ComponentViewConfig<LightweightButtonProps> = {
    schema: lightweightButtonSchema,
    component: LightweightButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Default lightweight button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Anchor lightweight button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Disabled lightweight button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Glyph before text lightweight button",
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
                children: "Glyph after text lightweight button",
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
