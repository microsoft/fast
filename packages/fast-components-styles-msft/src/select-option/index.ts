import {
    applyCornerRadius,
    applyDisabledState,
    applyFocusPlaceholderBorder,
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { SelectOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyFontSize, height, padding } from "../utilities/density";
import {
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import {
    applyLocalizedProperty,
    Direction,
    ellipsis,
} from "@microsoft/fast-jss-utilities";
import { applyCursorPointer } from "../utilities/cursor";

const styles: ComponentStyles<SelectOptionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<SelectOptionClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        selectOption: {
            listStyleType: "none",
            boxSizing: "border-box",
            height: height()(designSystem),
            display: "flex",
            alignItems: "center",
            padding: `0 ${padding(designSystem.focusOutlineWidth)(designSystem)}`,
            margin: `0 ${toPx(designSystem.designUnit)}`,
            color: neutralForegroundRest,
            fill: neutralForegroundRest,
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "default",
            ...applyFontSize(designSystem),
            background: neutralFillStealthRest,
            ...applyCursorPointer(),
            ...applyCornerRadius(designSystem),
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
            maxWidth: "16px",
            flexShrink: "0",
            margin: `${applyLocalizedProperty(
                `0 ${padding()(designSystem)} 0 0`,
                `0 0 0 ${padding()(designSystem)}`,
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
