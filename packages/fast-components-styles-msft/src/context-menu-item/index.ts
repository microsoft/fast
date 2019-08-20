import { applyCursorPointer } from "../utilities/cursor";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { add, applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { height, horizontalSpacingNumber } from "../utilities/density";
import { designUnit, focusOutlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import {
    highContrastDisabled,
    highContrastOutlineFocus,
    highContrastSelection,
    highContrastStealth,
} from "../utilities/high-contrast";

const glyphWidth: number = 16;
const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        listStyleType: "none",
        boxSizing: "border-box",
        height: height(),
        display: "grid",
        gridTemplateColumns: format(
            "{0} auto {0}",
            toPx(add(horizontalSpacingNumber(-2), glyphWidth, horizontalSpacingNumber()))
        ),
        gridTemplateRows: "auto",
        justifyItems: "center",
        alignItems: "center",
        padding: "0",
        margin: format("0 {0}", toPx<DesignSystem>(designUnit)),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        whiteSpace: "nowrap",
        overflow: "hidden",
        ...applyCursorPointer(),
        ...applyScaledTypeRamp("t7"),
        ...applyCornerRadius(),
        ...applyFocusPlaceholderBorder(),
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            ...highContrastOutlineFocus,
        }),
        "&:hover": {
            background: neutralFillStealthHover,
            ...highContrastSelection,
        },
        "&:active": {
            background: neutralFillStealthActive,
        },
        ...highContrastStealth,
    },
    contextMenuItem_contentRegion: {
        gridColumnStart: "2",
        justifySelf: "start",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
