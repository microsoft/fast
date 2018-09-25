import { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    disabledContrast,
    ensureForegroundNormal,
    ensureNormalContrast,
    hoverContrast,
    normalContrast
} from "../utilities/colors";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<IRadioClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IRadioClassNameContract, IDesignSystem>  => {
    const designSystem: IDesignSystem = withDesignSystemDefaults(config);
    const backgroundColor: string = designSystem.backgroundColor;

    return {
        radio: {
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center"
        },
        radio__disabled: {
            cursor: "not-allowed"
        },
        radio_input: {
            background: backgroundColor
        },
        radio_stateIndicator: {}
    };
};

export default styles;
