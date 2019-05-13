import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { add, applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { applyCursorDefault } from "../utilities/cursor";
import { height, horizontalSpacingNumber } from "../utilities/density";
import { designUnit } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

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
        ...applyCursorDefault(),
        ...applyScaledTypeRamp("t7"),
        ...applyCornerRadius(),
        ...applyFocusPlaceholderBorder(),
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
        }),
        "&:hover": {
            background: neutralFillStealthHover,
        },
        "&:active": {
            background: neutralFillStealthActive,
        },
    },
    contextMenuItem_contentRegion: {
        gridColumnStart: "2",
        justifySelf: "start",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    contextMenuItem__disabled: {
        ...applyDisabledState(),
    },
};

export default styles;
