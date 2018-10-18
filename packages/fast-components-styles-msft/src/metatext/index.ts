import designSystemDefaults, { DesignSystem } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules
} from "@microsoft/fast-jss-manager";
import { MetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { get } from "lodash-es";
import Chroma from "chroma-js";
import { applyTypeRampConfig } from "../utilities/typography";

/* tslint:disable-next-line */
const styles: ComponentStyles<MetatextClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<MetatextClassNameContract, DesignSystem> => {
    const backgroundColor: string =
        get(config, "backgroundColor") || designSystemDefaults.backgroundColor;
    const foregroundColor: string =
        get(config, "foregroundColor") || designSystemDefaults.foregroundColor;

    return {
        metatext: {
            ...applyTypeRampConfig("t7"),
            color: Chroma.mix(backgroundColor, foregroundColor, 0.6).css()
        }
    };
};

export default styles;
