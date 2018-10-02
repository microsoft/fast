import { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { IRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    disabledContrast,
    ensureNormalContrast,
    hoverContrast,
    normalContrast
} from "../utilities/colors";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<IRadioClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IRadioClassNameContract, IDesignSystem>  => {
    const designSystem: IDesignSystem = withDesignSystemDefaults(config);
    const backgroundColor: string = designSystem.backgroundColor;
    const foregroundColor: string = ensureNormalContrast(config.contrast, designSystem.foregroundColor, designSystem.backgroundColor);
    const radioColor: string = normalContrast(designSystem.contrast, foregroundColor, backgroundColor);
    const radioHover: string = hoverContrast(designSystem.contrast, foregroundColor, backgroundColor);
    const radioDisabled: string = disabledContrast(
        designSystem.contrast,
        foregroundColor,
        backgroundColor
    );

    return {
        radio: {
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center"
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
                    "&::after, &::before": {
                        position: "absolute",
                        zIndex: "1",
                        content: "\"\"",
                        borderRadius: "50%",
                        background: radioColor
                    }
                }
            },
        },
        radio_stateIndicator: {
            position: "relative",
            borderRadius: "50%",
            display: "inline-block",
            width: "20px",
            height: "20px",
            flexShrink: "0",
            marginRight: "5px",
            "&::before, &::after": {
                width: "2px"
           },
            "&::before": {
                top: "4px",
                left: "11px",
                height: "12px",
                transform: "rotate(40deg)"
            },
            "&::after": {
                top: "9px",
                left: "6px",
                height: "6px",
                transform: "rotate(-45deg)"
            }
        },
        radio__disabled: {
            cursor: "not-allowed",
            "& $radio_input": {
                boxShadow: `inset 0 0 0 1px ${radioDisabled}`
            },
        },
    };
};

export default styles;
