import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
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
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
import { ToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

const styles: ComponentStyles<ToggleClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ToggleClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        toggle: {
            display: "inline-block",
            color: neutralForegroundRest,
            transition: "all 0.2s ease-in-out",
        },
        toggle_label: {
            ...applyTypeRampConfig("t8"),
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
            top: "5px",
            left: "5px",
            transition: "all .1s ease",
            borderRadius: "10px",
            width: "10px",
            height: "10px",
            background: neutralForegroundRest,
            "@media (-ms-high-contrast:active)": {
                backgroundColor: "ButtonHighlight",
            },
        },
        toggle_input: {
            position: "relative",
            margin: "0",
            width: "44px",
            height: "20px",
            background: neutralFillInputRest,
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralOutlineRest(designSystem)}`,
            borderRadius: "20px",
            appearance: "none",
            outline: "none",
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
                boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralFocus(designSystem)}`,
            }),
        },
        toggle__checked: {
            "& $toggle_input": {
                background: accentFillRest,
                borderColor: accentFillRest,
                ...applyFocusVisible({
                    boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
                    border: `${toPx(
                        designSystem.outlinePatternOutlineWidth
                    )} solid ${neutralFocus(designSystem)}`,
                }),
            },
            "& $toggle_stateIndicator": {
                left: "28px",
                background: accentForegroundCut,
            },
        },
        toggle__disabled: {
            cursor: "not-allowed",
            opacity: "0.3",
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
            float: applyLocalizedProperty("left", "right", direction),
            [applyLocalizedProperty("padding-left", "padding-right", direction)]: "5px",
            userSelect: "none",
            marginTop: "0",
            paddingBottom: "0",
        },
    };
};

export default styles;
