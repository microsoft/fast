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
                children: "Neutral button",
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
            displayName: "Before content neutral button",
            data: {
                children: "Disabled neutral button",
                beforeContent: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.user,
                    },
                } as any,
            },
        },
        {
            displayName: "After content neutral button",
            data: {
                children: "Disabled neutral button",
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
