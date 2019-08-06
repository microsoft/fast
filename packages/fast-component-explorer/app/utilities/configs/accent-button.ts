import { ComponentViewConfig } from "./data.props";
import {
    AccentButton,
    AccentButtonProps,
    accentButtonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/accent-button/guidance";
import { glyphSchema, Icon } from "../../../app/components/glyph";

const accentButtonConfig: ComponentViewConfig<AccentButtonProps> = {
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
                children: "Anchor accent button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                disabled: true,
                children: "Disabled accent button",
            },
        },
        {
            displayName: "Before content accent button",
            data: {
                children: "Disabled accent button",
                beforeContent: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.user,
                    },
                } as any,
            },
        },
        {
            displayName: "After content accent button",
            data: {
                children: "Disabled accent button",
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
