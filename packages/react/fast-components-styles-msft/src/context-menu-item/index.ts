import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { add, applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyCursorPointer } from "../utilities/cursor";
import { DesignSystem } from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { height, horizontalSpacingNumber } from "../utilities/density";
import { designUnit, focusOutlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import {
    HighContrastColor,
    highContrastDisabled,
    highContrastSelected,
    highContrastSelector,
    highContrastStealth,
} from "../utilities/high-contrast";

const glyphWidth: number = 16;
const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        "list-style-type": "none",
        "box-sizing": "border-box",
        height: height(),
        display: "grid",
        "grid-template-columns": format(
            "{0} auto {0}",
            toPx(add(horizontalSpacingNumber(-2), glyphWidth, horizontalSpacingNumber()))
        ),
        "grid-template-rows": "auto",
        "justify-items": "center",
        "align-items": "center",
        padding: "0",
        margin: format("0 {0}", toPx<DesignSystem>(designUnit)),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        "white-space": "nowrap",
        overflow: "hidden",
        ...applyCursorPointer(),
        ...applyScaledTypeRamp("t7"),
        ...applyCornerRadius(),
        ...applyFocusPlaceholderBorder(),
        ...applyFocusVisible<DesignSystem>({
            "border-color": neutralFocus,
            [highContrastSelector]: {
                color: HighContrastColor.selectedText,
                fill: HighContrastColor.selectedText,
                background: HighContrastColor.selectedBackground,
                "box-shadow": format(
                    "0 0 0 {0} inset {1}",
                    toPx(focusOutlineWidth),
                    () => HighContrastColor.buttonText
                ),
            },
        }),
        "&:hover": {
            background: neutralFillStealthHover,
            ...highContrastSelected,
        },
        "&:active": {
            background: neutralFillStealthActive,
            ...highContrastSelected,
        },
        ...highContrastStealth,
    },
    contextMenuItem_contentRegion: {
        "grid-column-start": "2",
        "justify-self": "start",
        overflow: "hidden",
        "text-overflow": "ellipsis",
    },
    contextMenuItem__disabled: {
        ...applyDisabledState(),
        ...highContrastDisabled,
        "&:hover": {
            ...highContrastDisabled,
        },
    },
};

export default styles;
