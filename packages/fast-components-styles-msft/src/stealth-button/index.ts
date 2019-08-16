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
    applyHighContrastAdjustStealth,
    applyHighContrastDisabledBorder,
    applyHighContrastDisabledForeground,
    applyHighContrastHyperLink,
    applyHighContrastOutlineFocus,
    applyHighContrastSelectedForeground,
    applyHighContrastSelection,
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
            ...applyHighContrastSelection,
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastSelectedForeground,
            },
        },
        "&:active:enabled": {
            backgroundColor: neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            ...applyHighContrastOutlineFocus,
        }),
        "&:disabled": {
            ...applyHighContrastDisabledBorder,
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastDisabledForeground,
            },
        },
        ...applyHighContrastAdjustStealth,
        "a&": {
            ...applyHighContrastHyperLink,
            "&$button__disabled": {
                ...applyHighContrastDisabledBorder,
                "&:hover": {
                    ...applyHighContrastDisabledBorder,
                    "& $button_beforeContent, & $button_afterContent": {
                        ...applyHighContrastDisabledForeground,
                    },
                },
            },
        },
    },
};

export default styles;
