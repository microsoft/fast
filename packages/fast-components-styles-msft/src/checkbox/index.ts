import { IDesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { ICheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyTypeRampConfig } from "../utilities/typography";
import { applyLocalizedProperty, contrast, Direction, toPx } from "@microsoft/fast-jss-utilities";
import {
    disabledContrast,
    ensureForegroundNormal,
    ensureNormalContrast,
    hoverContrast,
    normalContrast
} from "../utilities/colors";
import { get } from "lodash-es";
import Chroma from "chroma-js";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<ICheckboxClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<ICheckboxClassNameContract, IDesignSystem> => {
    const designSystem: IDesignSystem = withDesignSystemDefaults(config);
    const backgroundColor: string = designSystem.backgroundColor;
    const foregroundColor: string = designSystem.foregroundColor;
    const brandColor: string = designSystem.brandColor;
    const direction: Direction = designSystem.direction;
    const checkboxColor: string = normalContrast(designSystem.contrast, foregroundColor, backgroundColor);
    const checkboxHover: string = hoverContrast(designSystem.contrast, foregroundColor, backgroundColor);
    const checkboxDisabled: string = disabledContrast(
        designSystem.contrast,
        foregroundColor,
        backgroundColor
    );

    return {
        checkbox: {
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
            boxSizing: "content-box",
            margin: "0",
            zIndex: "1",
            background: backgroundColor,
            boxShadow: `inset 0 0 0 1px ${checkboxColor}`,
            "&:hover": {
                boxShadow: `inset 0 0 0 1px ${checkboxHover}`,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `inset 0 0 0 2px ${checkboxColor}`,
            },
            "&:checked": {
                "& + span": {
                    "&::after, &::before": {
                        position: "absolute",
                        zIndex: "1",
                        content: "\"\"",
                        borderRadius: "2px",
                        background: checkboxColor
                    }
                }
            },
            "&:indeterminate": {
                "& + span": {
                    "&::before": {
                        position: "absolute",
                        zIndex: "1",
                        content: "\"\"",
                        borderRadius: "2px",
                        transform: "none",
                        [applyLocalizedProperty("left", "right", direction)]: "5px",
                        top: "5px",
                        height: "10px",
                        width: "10px",
                        background: checkboxColor
                    }
                }
            }
        },
        checkbox_stateIndicator: {
            position: "relative",
            borderRadius: "2px",
            display: "inline-block",
            width: "20px",
            height: "20px",
            flexShrink: "0",
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
        checkbox_label: {
            color: ensureNormalContrast(designSystem.contrast, foregroundColor, backgroundColor),
            ...applyTypeRampConfig("t7"),
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "5px",
        },
        checkbox__disabled: {
            cursor: "not-allowed",
            "& $checkbox_input": {
                boxShadow: `inset 0 0 0 1px ${checkboxDisabled}`,
                "&:checked, &:indeterminate": {
                    "& + $checkbox_stateIndicator": {
                        "&::after, &::before": {
                            backgroundColor: checkboxDisabled
                        }
                    }
                }
            },
            "& $checkbox_label": {
                color: checkboxDisabled
            },
        }
    };
};

export default styles;
