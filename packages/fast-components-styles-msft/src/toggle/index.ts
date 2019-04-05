import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    accentFillRest,
    accentForegroundCut,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillSelected,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { ToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { DensityCategory, getDensityCategory, heightNumber } from "../utilities/density";
import { format } from "../utilities/format";
import { outlineWidth } from "../utilities/design-system";

const styles: ComponentStyles<ToggleClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ToggleClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const height: number = heightNumber()(designSystem) / 2 + designSystem.designUnit;
    const width: number = height * 2;

    const category: DensityCategory = getDensityCategory(designSystem);
    const indicatorMarginOffset: number =
        category === DensityCategory.compact
            ? 0
            : category === DensityCategory.spacious
                ? 2
                : 1;

    const indicatorMargin: number = designSystem.designUnit + indicatorMarginOffset;
    const indicatorSize: number = height - indicatorMargin * 2;
    const indicatorCheckedLeft: number = width - indicatorMargin - indicatorSize;

    return {
        toggle: {
            display: "inline-block",
            color: neutralForegroundRest,
            transition: "all 0.2s ease-in-out",
        },
        toggle_label: {
            ...applyScaledTypeRamp("t7"),
            display: "block",
            paddingBottom: "7px",
            clear: "both",
        },
        toggle_toggleButton: {
            position: "relative",
            marginTop: "0",
            float: applyLocalizedProperty("left", "right", direction),
        },
        toggle_stateIndicator: {
            position: "absolute",
            pointerEvents: "none",
            top: toPx(indicatorMargin),
            left: toPx(indicatorMargin),
            transition: "all .1s ease",
            borderRadius: toPx(indicatorSize),
            width: toPx(indicatorSize),
            height: toPx(indicatorSize),
            background: neutralForegroundRest,
            "@media (-ms-high-contrast:active)": {
                backgroundColor: "ButtonHighlight",
            },
        },
        toggle_input: {
            position: "relative",
            margin: "0",
            width: toPx(width),
            height: toPx(height),
            background: neutralFillInputRest,
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineRest
            ),
            borderRadius: toPx(height),
            appearance: "none",
            outline: "none",
            "&:hover": {
                background: neutralFillInputHover,
                borderColor: neutralOutlineHover,
            },
            "&:active": {
                background: neutralFillInputActive,
                borderColor: neutralOutlineActive,
            },
            ...applyFocusVisible({
                boxShadow: format("0 0 0 1px {0} inset", neutralFocus),
                borderColor: neutralFocus,
            }),
        },
        toggle__checked: {
            "& $toggle_input": {
                background: accentFillRest,
                borderColor: accentFillRest,
                ...applyFocusVisible({
                    boxShadow: format("0 0 0 1px {0} inset", neutralFocus),
                    borderColor: neutralFocus,
                }),
            },
            "& $toggle_stateIndicator": {
                left: toPx(indicatorCheckedLeft),
                background: accentForegroundCut,
            },
        },
        toggle__disabled: {
            ...applyDisabledState(designSystem),
            "& $toggle_input": {
                background: neutralFillSelected,
                borderColor: neutralFillSelected,
            },
            "& $toggle_stateIndicator": {
                background: neutralForegroundRest,
            },
            "& $toggle_input, & $toggle_label, & $toggle_statusMessage": {
                cursor: "not-allowed",
            },
        },
        toggle_statusMessage: {
            ...applyScaledTypeRamp("t7"),
            lineHeight: toPx(height),
            float: applyLocalizedProperty("left", "right", direction),
            [applyLocalizedProperty("padding-left", "padding-right", direction)]: "5px",
            userSelect: "none",
            marginTop: "0",
            paddingBottom: "0",
        },
    };
};

export default styles;
