import designSystemDefaults, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import { disabledContrast, ensureNormalContrast } from "../utilities/colors";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    applyLocalizedProperty,
    Direction,
    ensureContrast,
    focusVisible,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { applyTypeRampConfig } from "../utilities/typography";
import { ToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Chroma from "chroma-js";
import outlinePattern from "../patterns/outline";
import switchFieldPattern from "../patterns/switch-field";
import typographyPattern from "../patterns/typography";

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
    const direction: Direction = designSystem.direction;

    return {
        toggle: {
            display: "inline-block",
            ...typographyPattern.rest,
            "& span": {
                userSelect: "none",
                marginTop: "0",
                paddingBottom: "0",
            },
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
            "& + span": {
                float: applyLocalizedProperty("left", "right", direction),
                [applyLocalizedProperty("margin-left", "margin-right", direction)]: "5px",
            },
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
            ...switchFieldPattern.rest.stateIndicator,
        },
        toggle_input: {
            position: "relative",
            margin: "0",
            width: "44px",
            height: "20px",
            ...outlinePattern.rest,
            borderRadius: "20px",
            appearance: "none",
            outline: "none",
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
            "&:hover": {
                ...outlinePattern.hover,
            },
            [`&${focusVisible()}`]: {
                ...outlinePattern.focus,
            },
            "&:checked": {
                backgroundColor: brandColor,
                borderColor: brandColor,
                [`&${focusVisible()}`]: {
                    borderColor: brandColor,
                    boxShadow: "none",
                },
                "& + $toggle_stateIndicator": {
                    left: "28px",
                    backgroundColor,
                },
            },
        },
        toggle__disabled: {
            ...typographyPattern.disabled,
            "& $toggle_input": {
                cursor: "not-allowed",
                ...outlinePattern.disabled,
                "& + $toggle_stateIndicator": {
                    ...switchFieldPattern.disabled.stateIndicator,
                },
                "&:checked": {
                    cursor: "not-allowed",
                    borderColor: "transparent",
                    ...switchFieldPattern.disabled.stateIndicator,
                    "& + $toggle_stateIndicator": {
                        background: backgroundColor,
                    },
                    "&:hover": {
                        borderColor: "transparent",
                    },
                },
            },
        },
    };
};

export default styles;
