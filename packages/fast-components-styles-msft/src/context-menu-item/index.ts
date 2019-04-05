import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    DesignSystem,
    DesignSystemResolver,
    withDesignSystemDefaults,
} from "../design-system";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { height, horizontalSpacingNumber } from "../utilities/density";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFocus,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
} from "../utilities/color";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { applyCursorDefault } from "../utilities/cursor";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { format } from "../utilities/format";
import { designUnit } from "../utilities/design-system";

const padding: DesignSystemResolver<string> = (designSystem: DesignSystem): string => {
    const glyphWidth: number = 16;

    return toPx(
        horizontalSpacingNumber(-2)(designSystem) +
            glyphWidth +
            horizontalSpacingNumber()(designSystem)
    );
};

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = {
    contextMenuItem: {
        listStyleType: "none",
        boxSizing: "border-box",
        height: height(),
        display: "grid",
        gridTemplateColumns: format("{0} auto {0}", padding),
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
            color: neutralForegroundHover,
            background: neutralFillStealthHover,
        },
        "&:active": {
            color: neutralForegroundActive,
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
