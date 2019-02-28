import designSystemDefaults, { DesignSystem } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { MetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { neutralForegroundHint } from "../utilities/color";
import { applyTypeRampConfig } from "../utilities/typography";

/* tslint:disable-next-line */
const styles: ComponentStyles<MetatextClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<MetatextClassNameContract, DesignSystem> => {
    return {
        metatext: {
            ...applyTypeRampConfig("t7"),
            color: neutralForegroundHint,
        },
    };
};

export default styles;
