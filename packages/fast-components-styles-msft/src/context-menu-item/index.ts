import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
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
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorDefault } from "../utilities/cursor";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<ContextMenuItemClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ContextMenuItemClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const glyphWidth: number = 16;
    const padding: number =
        horizontalSpacingNumber(-2)(designSystem) +
        glyphWidth +
        horizontalSpacingNumber()(designSystem);

    return {
        contextMenuItem: {
            listStyleType: "none",
            boxSizing: "border-box",
            height: height(),
            display: "grid",
            gridTemplateColumns: `${toPx(padding)} auto ${toPx(padding)}`,
            gridTemplateRows: "auto",
            justifyItems: "center",
            alignItems: "center",
            padding: "0",
            margin: `0 ${toPx(designSystem.designUnit)}`,
            color: neutralForegroundRest,
            fill: neutralForegroundRest,
            whiteSpace: "nowrap",
            overflow: "hidden",
            ...applyCursorDefault(),
            ...applyScaledTypeRamp("t7"),
            ...applyCornerRadius(designSystem),
            ...applyFocusPlaceholderBorder(designSystem),
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
            ...applyDisabledState(designSystem),
        },
    };
};

export default styles;
