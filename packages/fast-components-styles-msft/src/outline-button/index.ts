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
    highContrastDisabledBorder,
    highContrastDisabledForeground,
    highContrastOutline,
    highContrastOutlineFocus,
    highContrastSelection,
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
            ...highContrastSelection,
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
            ...highContrastOutlineFocus,
        }),
        "&:disabled": {
            ...highContrastDisabledBorder,
        },
        ...highContrastOutline,
        "a&": {
            "&$button__disabled": {
                ...highContrastDisabledBorder,
            },
        },
    },
};

export default styles;
