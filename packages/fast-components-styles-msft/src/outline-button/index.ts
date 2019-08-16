import { ButtonBaseClassNameContract as LightweightButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { DesignSystem, ensureDesignSystemDefaults } from "../design-system";
import { baseButton, buttonStyles } from "../patterns/button";
import {
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { horizontalSpacing } from "../utilities/density";
import { outlineWidth } from "../utilities/design-system";
import { applyFocusVisible, format, subtract, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyHighContrastAdjustOutline,
    applyHighContrastDisabledBorder,
    applyHighContrastDisabledForeground,
    applyHighContrastHyperLink,
    applyHighContrastOutlineFocus,
    applyHighContrastSelectedForeground,
    applyHighContrastSelection,
    highContrastSelector,
} from "../utilities/high-contrast";

const styles: ComponentStyles<LightweightButtonClassNameContract, DesignSystem> = {
    ...baseButton,
    button: {
        ...buttonStyles(),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: "transparent",
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        padding: format("0 {0}", horizontalSpacing(outlineWidth)),
        "&:hover:enabled": {
            background: "transparent",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineHover
            ),
            ...applyHighContrastSelection,
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastSelectedForeground,
            },
        },
        "&:active:enabled": {
            background: "transparent",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineActive
            ),
        },
        ...applyFocusVisible<DesignSystem>({
            boxShadow: ensureDesignSystemDefaults(
                (designSystem: DesignSystem): string => {
                    return `0 0 0 ${toPx(
                        designSystem.focusOutlineWidth - designSystem.outlineWidth
                    )} ${neutralFocus(designSystem)} inset`;
                }
            ),
            borderColor: neutralFocus,
            ...applyHighContrastOutlineFocus,
        }),
        "&:disabled": {
            ...applyHighContrastDisabledBorder,
            "& $button_beforeContent, & $button_afterContent": {
                ...applyHighContrastDisabledForeground,
            },
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
