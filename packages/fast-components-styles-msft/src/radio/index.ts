import {
    DesignSystem,
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
import { applyFontSize, densityToTypeOffset, padding } from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";

const styles: ComponentStyles<RadioClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<RadioClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const size: number =
        (designSystem.defaultHeightMultiplier + designSystem.density) *
            (designSystem.designUnit / 2) +
        designSystem.designUnit;
    const indicatorMargin: string = toPx(
        designSystem.designUnit + densityToTypeOffset(designSystem)
    );

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
            width: toPx(size),
            height: toPx(size),
            appearance: "none",
            borderRadius: "50%",
            margin: "0",
            zIndex: "1",
            background: neutralFillInputRest,
            transition: "all 0.2s ease-in-out",
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralOutlineRest(designSystem)}`,
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
            width: toPx(size),
            height: toPx(size),
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
            ...applyFontSize(designSystem),
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: padding(2)(
                designSystem
            ),
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
