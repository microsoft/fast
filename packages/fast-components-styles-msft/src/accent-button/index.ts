import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { baseButton, buttonStyles } from "../patterns/button";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundCut,
    neutralFocus,
    neutralFocusInnerAccent,
} from "../utilities/color";
import { focusOutlineWidth } from "../utilities/design-system";
import {
    applyHighContrastAccentSelectedFillHover,
    applyHighContrastAccentSelectedHover,
    applyHighContrastAdjustSelectOutline,
    applyHighContrastDisabledBorder,
    applyHighContrastDisabledFill,
    applyHighContrastDoubleFocus,
    applyHighContrastHyperLink,
    applyHighContrastSelectedHover,
    applyHighContrastSelectedColorFill
} from "../utilities/high-contrast";

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: accentForegroundCut,
        fill: accentForegroundCut,
        background: accentFillRest,
        "&:hover:enabled": {
            background: accentFillHover,
            ...applyHighContrastAccentSelectedHover(),
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastAccentSelectedFillHover(),
            },
        },
        "&:active:enabled": {
            background: accentFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            boxShadow: format(
                "0 0 0 2px inset {0}",
                neutralFocusInnerAccent(accentFillRest)
            ),
            ...applyHighContrastDoubleFocus()
        }),
        "&:disabled": {
            ...applyHighContrastDisabledBorder(),
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastDisabledFill()
            },
        },
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundCut,
            ...applyHighContrastSelectedColorFill(),
        },
        ...applyHighContrastAdjustSelectOutline(),
        "a&": {
            ...applyHighContrastHyperLink(),
            "&$button__disabled": {
                ...applyHighContrastDisabledBorder(),
                "& $button_beforeContent, & $button_afterContent": {
                    ...applyHighContrastDisabledFill()
                },
                "&:hover:enabled": {
                    ...applyHighContrastDisabledBorder(),
                    "& $button_beforeContent, & $button_afterContent": {
                        ...applyHighContrastDisabledFill()
                    },
                },
            },
        },
    },
};

export default styles;
