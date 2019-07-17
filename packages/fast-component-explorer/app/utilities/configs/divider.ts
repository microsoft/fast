import { ComponentViewConfig } from "./data.props";
import {
    Divider,
    DividerClassNameContract,
    DividerProps,
    dividerSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/divider/guidance";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";

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
            displayName: "Default",
            data: {
                jssStyleSheet: styles,
            },
        },
    ],
};

export default dividerConfig;
