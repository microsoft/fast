import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { RadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import outlinePattern from "../patterns/outline";
import {
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";

const styles: ComponentStyles<RadioClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<RadioClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        radio: {
            position: "relative",
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
        },
        radio_input: {
            position: "absolute",
            width: "20px",
            height: "20px",
            appearance: "none",
            borderRadius: "50%",
            margin: "0",
            zIndex: "1",
            background: neutralFillInputRest,
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralOutlineRest(designSystem)}`,
            ...applyFocusVisible({
                ...outlinePattern.focus,
            }),
            "&:hover": {
                background: neutralFillInputHover,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralOutlineHover(designSystem)}`,
            },
            "&:active": {
                background: neutralFillInputActive,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralOutlineActive(designSystem)}`,
            },
            ...applyFocusVisible({
                boxShadow: `0 0 0 1px ${designSystem.foregroundColor} inset`,
                border: `${toPx(designSystem.outlinePatternOutlineWidth)} solid ${
                    designSystem.foregroundColor
                }`,
            }),
        },
        radio_stateIndicator: {
            position: "relative",
            borderRadius: "50%",
            display: "inline-block",
            width: "20px",
            height: "20px",
            flexShrink: "0",
            "&::before": {
                pointerEvents: "none",
                position: "absolute",
                zIndex: "1",
                content: '""',
                borderRadius: "50%",
                top: "4px",
                left: "4px",
                height: "12px",
                width: "12px",
                background: "transparent",
            },
        },
        radio_label: {
            color: neutralForegroundRest,
            ...applyTypeRampConfig("t7"),
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "8px",
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
            opacity: "0.3",
            cursor: "not-allowed",
        },
    };
};

export default styles;
