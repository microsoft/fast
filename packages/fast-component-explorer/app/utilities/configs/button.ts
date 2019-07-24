import { ComponentViewConfig } from "./data.props";
import {
    Button,
    ButtonAppearance,
    ButtonProps,
    buttonSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/button/guidance";

const buttonConfig: ComponentViewConfig<ButtonProps> = {
    schema: buttonSchema,
    component: Button,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Button",
            },
        },
        {
            displayName: "Anchor",
            data: {
                href: "#",
                children: "Anchor button",
            },
        },
        {
            displayName: "Disabled",
            data: {
                appearance: ButtonAppearance.primary,
                disabled: true,
                children: "Disabled button",
            },
        },
    ],
};

export default buttonConfig;
