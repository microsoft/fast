import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyCursorPointer } from "../utilities/cursor";
import { add, applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { height, horizontalSpacingNumber } from "../utilities/density";
import { designUnit, focusOutlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import {
    applyHighContrastAdjustStealth,
    applyHighContrastDisabled,
    applyHighContrastSelection,
    highContrastSelector,
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
            [highContrastSelector]: {
                boxShadow: format(`0 0 0 {0} inset ButtonText`, toPx(focusOutlineWidth)),
            },
        }),
        "&:hover": {
            background: neutralFillStealthHover,
            ...applyHighContrastSelection,
        },
        "&:active": {
            background: neutralFillStealthActive,
        },
        ...applyHighContrastAdjustStealth,
    },
    contextMenuItem_contentRegion: {
        gridColumnStart: "2",
        justifySelf: "start",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    contextMenuItem__disabled: {
        ...applyDisabledState(),
        ...applyHighContrastDisabled,
        "&:hover": {
            ...applyHighContrastDisabled,
        },
    },
};

export default styles;
