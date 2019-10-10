import { ButtonBaseClassNameContract as StealthButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
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
import {
    highContrastDisabledBorder,
    highContrastLinkBorder,
    highContrastLinkOutline,
    highContrastOutlineFocus,
    highContrastSelected,
    highContrastSelector,
    highContrastStealth,
} from "../utilities/high-contrast";

const styles: ComponentStyles<StealthButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillStealthRest,
        "&:hover:enabled": {
            "background-color": neutralFillStealthHover,
            ...highContrastSelected,
        },
        "&:active:enabled": {
            "background-color": neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            "border-color": neutralFocus,
            ...highContrastOutlineFocus,
        }),
        "&:disabled": {
            ...highContrastDisabledBorder,
        },
        ...highContrastStealth,
        "a&": {
            ...highContrastLinkOutline,
            "&:hover": {
                ...highContrastLinkBorder,
            },
            "&$button__disabled": {
                ...highContrastDisabledBorder,
                "&:hover": {
                    [highContrastSelector]: {
                        "box-shadow": "none !important",
                    },
                },
            },
        },
    },
};

export default styles;
