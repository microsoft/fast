import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { baseButton, buttonStyles } from "../patterns/button";

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillStealthRest,
        "&:hover:enabled": {
            backgroundColor: neutralFillStealthHover,
        },
        "&:active:enabled": {
            backgroundColor: neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
        }),
    },
};

export default styles;
