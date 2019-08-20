import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { baseButton, buttonStyles } from "../patterns/button";
import {
    highContrastDisabledBorder,
    highContrastOutlineFocus,
    highContrastSelection,
    highContrastStealth,
} from "../utilities/high-contrast";

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillStealthRest,
        "&:hover:enabled": {
            backgroundColor: neutralFillStealthHover,
            ...highContrastSelection,
        },
        "&:active:enabled": {
            backgroundColor: neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            ...highContrastOutlineFocus,
        }),
        "&:disabled": {
            ...highContrastDisabledBorder,
        },
        ...highContrastStealth,
        "a&": {
            "&$button__disabled": {
                ...highContrastDisabledBorder,
            },
        },
    },
};

export default styles;
