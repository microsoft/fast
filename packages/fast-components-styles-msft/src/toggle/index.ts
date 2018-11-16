import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import {
    disabledContrast,
    ensureNormalContrast,
    normalContrast,
} from "../utilities/colors";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    applyLocalizedProperty,
    Direction,
    ensureContrast,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
import { ToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Chroma from "chroma-js";

/* tslint:disable-next-line */
const styles: ComponentStyles<ToggleClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ToggleClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const backgroundColor: string = ensureNormalContrast(
        config.contrast,
        designSystem.backgroundColor,
        designSystem.foregroundColor
    );
    const brandColor: string = ensureNormalContrast(
        config.contrast,
        designSystem.brandColor,
        designSystem.backgroundColor
    );
    const foregroundColor: string = ensureNormalContrast(
        config.contrast,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );
    const checkedBackplateColor: string = normalContrast(
        config.contrast,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );
    const direction: Direction = designSystem.direction;

    return {
        toggle: {
            display: "inline-block",
            color: foregroundColor,
            "& span": {
                userSelect: "none",
                marginTop: "0",
                paddingBottom: "0",
            },
            '&[aria-disabled="true"]': {
                color: disabledContrast(
                    designSystem.contrast,
                    foregroundColor,
                    backgroundColor
                ),
            },
        },
        toggle_label: {
            ...applyTypeRampConfig("t8"),
            display: "inline-block",
            foreground: foregroundColor,
            paddingBottom: "7px",
            float: applyLocalizedProperty("left", "right", direction),
            clear: applyLocalizedProperty("left", "right", direction),
            "& + div": {
                marginTop: "0",
                float: applyLocalizedProperty("left", "right", direction),
                clear: applyLocalizedProperty("left", "right", direction),
                "& + span": {
                    float: applyLocalizedProperty("left", "right", direction),
                    [applyLocalizedProperty(
                        "margin-left",
                        "margin-right",
                        direction
                    )]: "5px",
                },
            },
        },
        toggle_toggleButton: {
            position: "relative",
        },
        toggle_stateIndicator: {
            position: "absolute",
            pointerEvents: "none",
            top: "5px",
            left: "5px",
            transition: "all .1s ease",
            backgroundColor,
            borderRadius: "10px",
            width: "10px",
            height: "10px",
        },
        toggle_input: {
            position: "relative",
            margin: "0",
            width: "44px",
            height: "20px",
            background: backgroundColor,
            border: "1px solid",
            borderColor: foregroundColor,
            borderRadius: "20px",
            appearance: "none",
            "@media screen and (-ms-high-contrast:active)": {
                "&::after, &:checked + span": {
                    background: backgroundColor,
                },
            },
            "@media screen and (-ms-high-contrast:black-on-white)": {
                "&::after, &:checked + span": {
                    background: foregroundColor,
                },
            },
            "&:checked": {
                backgroundColor: checkedBackplateColor,
                borderColor: checkedBackplateColor,
                "&:focus": {
                    borderColor: checkedBackplateColor,
                },
                "& + span": {
                    left: "28px",
                    backgroundColor,
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    background: disabledContrast(
                        designSystem.contrast,
                        foregroundColor,
                        backgroundColor
                    ),
                    borderColor: "transparent",
                    "& + span": {
                        background: backgroundColor,
                    },
                    "&:hover": {
                        borderColor: "transparent",
                    },
                },
            },
            "&:not(:checked)": {
                borderColor: foregroundColor,
                "& + span": {
                    backgroundColor: foregroundColor,
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    borderColor: disabledContrast(
                        designSystem.contrast,
                        foregroundColor,
                        backgroundColor
                    ),
                    "& + span": {
                        backgroundColor: disabledContrast(
                            designSystem.contrast,
                            foregroundColor,
                            backgroundColor
                        ),
                    },
                },
            },
            "&:focus": {
                outline: "0",
                "& + $toggle_stateIndicator": {
                    transform: "scale(1.2)",
                },
            },
        },
    };
};

export default styles;
