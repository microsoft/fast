import { ComponentViewConfig } from "./data.props";
import {
    NeutralButton,
    NeutralButtonProps,
    neutralButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const neutralButtonConfig: ComponentViewConfig<NeutralButtonProps> = {
    schema: neutralButtonSchema,
    component: NeutralButton,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Default neutral button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Anchor neutral button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Disabled neutral button",
            },
        },
        {
            displayName: "Glyph before text",
            data: {
                children: "Glyph before text neutral button",
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
                children: "Glyph after text neutral button",
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
