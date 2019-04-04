import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { CheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { applyCornerRadius } from "../utilities/border";
import {
    DensityCategory,
    getDensityCategory,
    heightNumber,
    horizontalSpacing,
} from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { outlineWidth } from "../utilities/design-system";
import { format } from "../utilities/format";

const styles: ComponentStyles<CheckboxClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CheckboxClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const size: number = heightNumber()(designSystem) / 2 + designSystem.designUnit;

    const category: DensityCategory = getDensityCategory(designSystem);
    const indicatorMarginOffset: number =
        category === DensityCategory.compact
            ? 0
            : category === DensityCategory.spacious
                ? 2
                : 1;
    const indeterminateIndicatorMargin: string = toPx(
        designSystem.designUnit + indicatorMarginOffset
    );

    const indicatorSvg: string = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="${encodeURIComponent(
        neutralForegroundRest(designSystem)
    )}" fill-rule="evenodd" clip-rule="evenodd" d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"/></svg>`;
    const indicatorSvgHc: string = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="ButtonHighlight" fill-rule="evenodd" clip-rule="evenodd" d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"/></svg>`;

    return {
        checkbox: {
            position: "relative",
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            transition: "all 0.2s ease-in-out",
            "& $checkbox_label": {
                [applyLocalizedProperty(
                    "paddingLeft",
                    "paddingRight",
                    direction
                )]: horizontalSpacing(2),
            },
        },
        checkbox_input: {
            position: "absolute",
            width: toPx(size),
            height: toPx(size),
            appearance: "none",
            ...applyCornerRadius(),
            boxSizing: "border-box",
            margin: "0",
            zIndex: "1",
            background: neutralFillInputRest,
            transition: "all 0.2s ease-in-out",
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineRest
            ),
            "&:hover": {
                background: neutralFillInputHover,
                borderColor: neutralOutlineHover,
            },
            "&:active": {
                background: neutralFillInputActive,
                borderColor: neutralOutlineActive,
            },
            ...applyFocusVisible({
                boxShadow: format(`0 0 0 1px {0} inset`, neutralFocus),
                borderColor: neutralFocus,
            }),
        },
        checkbox_stateIndicator: {
            position: "relative",
            ...applyCornerRadius(),
            display: "inline-block",
            width: toPx(size),
            height: toPx(size),
            flexShrink: "0",
            "&::before": {
                content: "''",
                pointerEvents: "none",
                position: "absolute",
                zIndex: "1",
                top: "0",
                left: "0",
                width: toPx(size),
                height: toPx(size),
            },
        },
        checkbox_label: {
            color: neutralForegroundRest,
            ...applyScaledTypeRamp("t7"),
        },
        checkbox__checked: {
            "& $checkbox_stateIndicator": {
                "&::before": {
                    background: `url('data:image/svg+xml;utf8,${indicatorSvg}')`,
                    "@media (-ms-high-contrast:active)": {
                        background: `url('data:image/svg+xml;utf8,${indicatorSvgHc}')`,
                    },
                },
            },
        },
        checkbox__indeterminate: {
            "& $checkbox_stateIndicator": {
                "&::before": {
                    ...applyCornerRadius(),
                    transform: "none",
                    top: indeterminateIndicatorMargin,
                    right: indeterminateIndicatorMargin,
                    bottom: indeterminateIndicatorMargin,
                    left: indeterminateIndicatorMargin,
                    width: "auto",
                    height: "auto",
                    background: neutralForegroundRest,
                    "@media (-ms-high-contrast:active)": {
                        backgroundColor: "ButtonHighlight",
                    },
                },
            },
        },
        checkbox__disabled: {
            ...applyDisabledState(designSystem),
        },
    };
};

export default styles;
