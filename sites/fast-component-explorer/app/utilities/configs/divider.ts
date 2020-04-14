import {
    Divider,
    DividerClassNameContract,
    DividerProps,
    dividerSchema,
} from "@microsoft/fast-components-react-msft";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import Guidance from "../../.tmp/divider/guidance";
import { ComponentViewConfig } from "./data.props";

const styles: ComponentStyleSheet<DividerClassNameContract, DesignSystem> = {
    divider: {
        margin: "12px",
    },
};

const dividerConfig: ComponentViewConfig<DividerProps> = {
    schema: dividerSchema,
    component: Divider,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                jssStyleSheet: styles,
            },
        },
    ],
};

export default dividerConfig;
