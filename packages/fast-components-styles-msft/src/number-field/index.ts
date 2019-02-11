import designSystemDefaults, { DesignSystem } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { NumberFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";
import Chroma from "chroma-js";
import { applyTypeRampConfig } from "../utilities/typography";

/* tslint:disable-next-line */
const styles: ComponentStyles<NumberFieldClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<NumberFieldClassNameContract, DesignSystem> => {
    return {
        numberField: {
            display: "inline-block",
        },
    };
};

export default styles;
