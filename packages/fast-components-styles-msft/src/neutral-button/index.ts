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
    applyHighContrastDisabledForeground,
    applyHighContrastHyperLink,
    applyHighContrastOutlineFocus,
    applyHighContrastSelectedForeground,
    applyHighContrastSelection,
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
            ...applyHighContrastSelection,
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastSelectedForeground,
            },
        },
        "&:active:enabled": {
            background: neutralFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            ...applyHighContrastOutlineFocus,
        }),
        "&:disabled": {
            ...applyHighContrastDisabledBorder,
            "a&": {
                ...applyHighContrastDisabledForeground,
            },
        },
        "&::-moz-focus-inner": {
            border: "0",
        },
        ...applyHighContrastAdjustOutline,
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
