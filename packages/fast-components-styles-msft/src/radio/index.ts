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

/* tslint:disable:max-line-length */
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
            boxSizing: "content-box",
            margin: "0",
            zIndex: "1",
            background: backgroundColor,
            boxShadow: `inset 0 0 0 1px ${radioColor}`,
            "&:hover": {
                boxShadow: `inset 0 0 0 1px ${radioHover}`,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `inset 0 0 0 2px ${radioColor}`,
            },
            "&:checked": {
                "& + span": {
                    "&::before": {
                        position: "absolute",
                        zIndex: "1",
                        content: '""',
                        borderRadius: "50%",
                        background: radioColor,
                    },
                },
            },
        },
        radio_stateIndicator: {
            position: "relative",
            borderRadius: "50%",
            display: "inline-block",
            width: "20px",
            height: "20px",
            flexShrink: "0",
            color: radioDisabled,
            "&::before": {
                top: "4px",
                left: "4px",
                height: "12px",
                width: "12px",
            },
        },
        radio__disabled: {
            cursor: "not-allowed",
            "& $radio_input": {
                boxShadow: `inset 0 0 0 1px ${radioDisabled}`,
                "&:checked": {
                    "& + span::before": {
                        background: radioDisabled,
                    },
                },
            },
            "& $radio_label": {
                cursor: "not-allowed",
                color: radioDisabled,
            },
        },
        radio_label: {
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "5px",
        },
    };
};

export default styles;
