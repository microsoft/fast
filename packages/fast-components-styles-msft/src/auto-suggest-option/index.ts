import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { AutoSuggestOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { height, horizontalSpacing } from "../utilities/density";
import {
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { applyFocusVisible } from "@microsoft/fast-jss-utilities";
import { applyScaledTypeRamp } from "../utilities/typography";
import {
    applyLocalizedProperty,
    Direction,
    ellipsis,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorDefault } from "../utilities/cursor";
import { applyDisabledState } from "../utilities/disabled";
import { format } from "../utilities/format";

const styles: ComponentStyles<AutoSuggestOptionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<AutoSuggestOptionClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        autoSuggestOption: {
            listStyleType: "none",
            height: height(),
            display: "grid",
            gridTemplateColumns: `${applyLocalizedProperty(
                format("{0} auto auto 1fr {0}", horizontalSpacing())(designSystem),
                format("{0} 1fr auto auto {0}", horizontalSpacing())(designSystem),
                direction
            )}`,
            gridTemplateRows: "auto",
            alignItems: "center",
            padding: "0",
            margin: `0 ${toPx(designSystem.designUnit)}`,
            whiteSpace: "nowrap",
            overflow: "hidden",
            ...applyCursorDefault(),
            color: neutralForegroundRest,
            ...applyScaledTypeRamp("t7"),
            background: neutralFillStealthRest,
            ...applyCornerRadius(),
            ...applyFocusPlaceholderBorder(designSystem),
            ...applyFocusVisible<DesignSystem>({
                borderColor: neutralFocus,
            }),
            "&:hover": {
                background: neutralFillStealthHover,
            },
        },
        autoSuggestOption_contentRegion: {
            gridColumnStart: "3",
            overflow: "hidden",
            ...ellipsis(),
        },
        autoSuggestOption__disabled: {
            ...applyDisabledState(designSystem),
            "&:hover": {
                background: neutralFillStealthRest,
            },
        },
        autoSuggestOption__selected: {
            background: neutralFillStealthSelected,
            "&:hover": {
                background: neutralFillStealthSelected,
            },
        },
    };
};

export default styles;
