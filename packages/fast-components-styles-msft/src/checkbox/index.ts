import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { CheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import {
    applyLocalizedProperty,
    contrast,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    disabledContrast,
    ensureNormalContrast,
    normalContrast,
} from "../utilities/colors";
import outlinePattern from "../patterns/outline";
import toggleFieldPattern from "../patterns/toggle-field";

const styles: ComponentStyles<CheckboxClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CheckboxClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const backgroundColor: string = designSystem.backgroundColor;
    const foregroundColor: string = designSystem.foregroundColor;
    const direction: Direction = designSystem.direction;
    const checkboxColor: any = toggleFieldPattern.rest.stateIndicator.checked.background(
        designSystem
    );
    // const checkboxColor: string = normalContrast(
    //     designSystem.contrast,
    //     foregroundColor,
    //     backgroundColor
    // );
    const checkboxDisabled: string = disabledContrast(
        designSystem.contrast,
        foregroundColor,
        backgroundColor
    );

    return {
        checkbox: {
            position: "relative",
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
        },
        checkbox_input: {
            position: "absolute",
            width: "20px",
            height: "20px",
            appearance: "none",
            borderRadius: "2px",
            boxSizing: "border-box",
            margin: "0",
            zIndex: "1",
            background: backgroundColor,
            ...outlinePattern.rest,
            "&:hover": {
                ...outlinePattern.hover,
            },
            "&:focus": {
                outline: "none",
                ...outlinePattern.focus,
            },
        },
        checkbox_stateIndicator: {
            position: "relative",
            borderRadius: "2px",
            display: "inline-block",
            width: "20px",
            height: "20px",
            flexShrink: "0",
            "&::before, &::after": {
                content: "''",
                width: "2px",
                position: "absolute",
                zIndex: "1",
            },
            "&::before": {
                top: "4px",
                left: "11px",
                height: "12px",
                transform: "rotate(40deg)",
            },
            "&::after": {
                top: "9px",
                left: "6px",
                height: "6px",
                transform: "rotate(-45deg)",
            },
        },
        checkbox_label: {
            color: ensureNormalContrast(
                designSystem.contrast,
                foregroundColor,
                backgroundColor
            ),
            ...applyTypeRampConfig("t7"),
            [applyLocalizedProperty("paddingLeft", "paddingRight", direction)]: "8px",
        },
        checkbox__checked: {
            "& $checkbox_stateIndicator": {
                "&::after, &::before": {
                    position: "absolute",
                    zIndex: "1",
                    content: '""',
                    borderRadius: toPx(designSystem.cornerRadius),
                    ...toggleFieldPattern.rest.stateIndicator.checked,
                },
            },
        },
        checkbox__indeterminate: {
            "& $checkbox_stateIndicator": {
                "&::before": {
                    borderRadius: "2px",
                    transform: "none",
                    [applyLocalizedProperty("left", "right", direction)]: "5px",
                    top: "5px",
                    height: "10px",
                    width: "10px",
                    ...toggleFieldPattern.rest.stateIndicator.checked,
                },
                "&::after": {
                    content: "none",
                },
            },
        },
        checkbox__disabled: {
            "& $checkbox_input, & $checkbox_label,": {
                cursor: "not-allowed",
            },
            "& $checkbox_input": {
                ...outlinePattern.disabled,
            },
            "& $checkbox_stateIndicator": {
                "&::after, &::before": {
                    ...toggleFieldPattern.disabled.stateIndicator.checked,
                },
            },
            "& $checkbox_label": {
                color: checkboxDisabled,
            },
        },
    };
};

export default styles;
