import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { RadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyLocalizedProperty, Direction } from "@microsoft/fast-jss-utilities";
import {
    disabledContrast,
    ensureNormalContrast,
    hoverContrast,
    normalContrast,
} from "../utilities/colors";
import outlinePattern from "../patterns/outline";
import toggleFieldPattern from "../patterns/toggle-field";

const styles: ComponentStyles<RadioClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<RadioClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const backgroundColor: string = designSystem.backgroundColor;
    const foregroundColor: string = ensureNormalContrast(
        config.contrast,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );
    const direction: Direction = designSystem.direction;
    const radioColor: string = normalContrast(
        designSystem.contrast,
        foregroundColor,
        backgroundColor
    );
    const radioHover: string = hoverContrast(
        designSystem.contrast,
        foregroundColor,
        backgroundColor
    );
    const radioDisabled: string = disabledContrast(
        designSystem.contrast,
        foregroundColor,
        backgroundColor
    );

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
            ...outlinePattern.rest,
            "&:hover": {
                ...outlinePattern.hover,
            },
            "&:focus": {
                outline: "none",
                ...outlinePattern.focus,
            },
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
                ...toggleFieldPattern.rest.stateIndicator.unchecked,
            },
        },
        radio_label: {
            ...toggleFieldPattern.rest.text,
            [applyLocalizedProperty("paddingLeft", "paddingRight", direction)]: "8px",
        },
        radio__checked: {
            "& $radio_stateIndicator": {
                "&::before": {
                    ...toggleFieldPattern.rest.stateIndicator.checked,
                },
            },
        },
        radio__disabled: {
            "& $radio_label, & $radio_stateIndicator, & $radio_input": {
                cursor: "not-allowed",
            },
            "& $radio_input": {
                ...outlinePattern.disabled,
                "&:checked": {},
            },
            "& $radio_label": {
                ...toggleFieldPattern.disabled.text,
            },
            "&$radio__checked": {
                "& $radio_stateIndicator::before": {
                    ...toggleFieldPattern.disabled.stateIndicator.checked,
                },
            },
        },
    };
};

export default styles;
