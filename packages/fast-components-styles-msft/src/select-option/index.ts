import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { SelectOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import {
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    applyLocalizedProperty,
    Direction,
    ellipsis,
} from "@microsoft/fast-jss-utilities";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorDefault, applyCursorPointer } from "../utilities/cursor";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<SelectOptionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SelectOptionClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        selectOption: {
            listStyleType: "none",
            boxSizing: "border-box",
            height: height(),
            display: "flex",
            alignItems: "center",
            padding: `0 ${horizontalSpacing(designSystem.focusOutlineWidth)(
                designSystem
            )}`,
            margin: `0 ${toPx(designSystem.designUnit)}`,
            color: neutralForegroundRest,
            fill: neutralForegroundRest,
            whiteSpace: "nowrap",
            overflow: "hidden",
            ...applyCursorDefault(),
            ...applyScaledTypeRamp("t7"),
            background: neutralFillStealthRest,
            ...applyCursorPointer(),
            ...applyCornerRadius(),
            ...applyFocusPlaceholderBorder(designSystem),
            ...applyFocusVisible<DesignSystem>({
                borderColor: neutralFocus,
            }),
            "&:hover": {
                background: neutralFillStealthHover,
            },
        },
        selectOption_contentRegion: {
            overflow: "hidden",
            ...ellipsis(),
        },
        selectOption_glyph: {
            display: "inline-block",
            position: "relative",
            width: glyphSize(),
            height: glyphSize(),
            flexShrink: "0",
            margin: `${applyLocalizedProperty(
                `0 ${horizontalSpacing()(designSystem)} 0 0`,
                `0 0 0 ${horizontalSpacing()(designSystem)}`,
                direction
            )}`,
        },
        selectOption__disabled: {
            ...applyDisabledState(designSystem),
            "&, &:hover": {
                background: neutralFillStealthRest,
            },
        },
        selectOption__selected: {
            background: neutralFillStealthSelected,
            "&:hover": {
                background: neutralFillStealthSelected,
            },
        },
    };
};

export default styles;
