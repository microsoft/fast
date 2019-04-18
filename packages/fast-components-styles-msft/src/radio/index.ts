import {
    DesignSystem,
    DesignSystemResolver,
    withDesignSystemDefaults,
} from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { RadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
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
import {
    densityCategorySwitch,
    height,
    heightNumber,
    horizontalSpacing,
} from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<RadioClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<RadioClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const size: string = toPx(heightNumber()(designSystem) / 2 + designSystem.designUnit);

    const indicatorMarginOffset: number = densityCategorySwitch(0, 2, 1)(designSystem);
    const indicatorMargin: string = toPx(designSystem.designUnit + indicatorMarginOffset);

    return {
        radio: {
            position: "relative",
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            transition: "all 0.2s ease-in-out",
        },
        radio_input: {
            position: "absolute",
            width: size,
            height: size,
            appearance: "none",
            borderRadius: "50%",
            margin: "0",
            zIndex: "1",
            background: neutralFillInputRest,
            transition: "all 0.2s ease-in-out",
            border: `${toPx(designSystem.outlineWidth)} solid ${neutralOutlineRest(
                designSystem
            )}`,
            "&:hover": {
                background: neutralFillInputHover,
                borderColor: neutralOutlineHover,
            },
            "&:active": {
                background: neutralFillInputActive,
                borderColor: neutralOutlineActive,
            },
            ...applyFocusVisible({
                boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
                borderColor: neutralFocus(designSystem),
            }),
        },
        radio_stateIndicator: {
            position: "relative",
            borderRadius: "50%",
            display: "inline-block",
            width: size,
            height: size,
            flexShrink: "0",
            "&::before": {
                pointerEvents: "none",
                position: "absolute",
                zIndex: "1",
                content: '""',
                borderRadius: "50%",
                top: indicatorMargin,
                left: indicatorMargin,
                bottom: indicatorMargin,
                right: indicatorMargin,
                background: "transparent",
            },
        },
        radio_label: {
            color: neutralForegroundRest,
            ...applyScaledTypeRamp("t7"),
            [applyLocalizedProperty(
                "marginLeft",
                "marginRight",
                direction
            )]: horizontalSpacing(2)(designSystem),
        },
        radio__checked: {
            "& $radio_stateIndicator": {
                "&::before": {
                    background: neutralForegroundRest,
                    "@media (-ms-high-contrast:active)": {
                        backgroundColor: "ButtonHighlight",
                    },
                },
            },
        },
        radio__disabled: {
            ...applyDisabledState(designSystem),
        },
    };
};

export default styles;
