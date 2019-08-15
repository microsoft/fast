import { ButtonBaseClassNameContract as NeutralButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { baseButton, buttonStyles } from "../patterns/button";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import {
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import {
    applyHighContrastAdjustOutline,
    applyHighContrastDisabledBorder,
    applyHighContrastDisabledColor,
    applyHighContrastDisabledFill,
    applyHighContrastHyperLink,
    applyHighContrastInsetFocus,
    applyHighContrastSelectedFillHover,
    applyHighContrastSelectedHover,
} from "../utilities/high-contrast";

const styles: ComponentStyles<NeutralButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillRest,
        "&:hover:enabled": {
            background: neutralFillHover,
            ...applyHighContrastSelectedHover(),
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastSelectedFillHover(),
            },
        },
        "&:active:enabled": {
            background: neutralFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            ...applyHighContrastInsetFocus(),
        }),
        "&:disabled": {
            ...applyHighContrastDisabledBorder(),
            "a&": {
                ...applyHighContrastDisabledColor(),
            },
        },
        "&::-moz-focus-inner": {
            border: "0",
        },
        ...applyHighContrastAdjustOutline(),
        "a&": {
            ...applyHighContrastHyperLink(),
            "&$button__disabled": {
                ...applyHighContrastDisabledBorder(),
                "&:hover": {
                    ...applyHighContrastDisabledBorder(),
                    "& $button_beforeContent, & $button_afterContent": {
                        ...applyHighContrastDisabledFill(),
                    },
                },
            },
        },
    },
};

export default styles;
