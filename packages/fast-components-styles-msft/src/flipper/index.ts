import { IDesignSystem, safeDesignSystem } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { IFlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, contrast, Direction, toPx } from "@microsoft/fast-jss-utilities";
import { applyMixedColor, ensureNormalContrast, normalContrast } from "../utilities/colors";
import { get } from "lodash-es";
import Chroma from "chroma-js";

const eastFlipperTransform: string = "translateX(-3px) rotate(45deg)";
const westFlipperTransform: string = "translateX(3px) rotate(-135deg)";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<IFlipperClassNameContract, IDesignSystem> = (config: IDesignSystem): ComponentStyleSheet<IFlipperClassNameContract, IDesignSystem> => {
/* tslint:enable:max-line-length */
    const designSystem: IDesignSystem = safeDesignSystem(config);

    const backgroundColor: string = designSystem.backgroundColor;
    const direction: Direction = designSystem.direction;
    const foregroundColor: string = ensureNormalContrast(
        designSystem.contrast,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );

    const borderColor: string = normalContrast(
        designSystem.contrast,
        foregroundColor,
        designSystem.backgroundColor
    );

    return {
        button: {
            width: "40px",
            height: "40px",
            margin: "0",
            color: foregroundColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "50%",
            background: backgroundColor,
            padding: "0",
            "&:hover": {
                cursor: "pointer"
            },
            "&:focus": {
                boxShadow: `0 0 0 1px inset ${borderColor}`,
                outline: "none"
            }
        },
        flipper_glyph: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: toPx(14),
            height: toPx(14),
            "&::before": {
                boxSizing: "border-box",
                height: toPx(12),
                width: toPx(12),
                content: "\"\"",
                borderRight: `${toPx(1)} solid ${foregroundColor}`,
                borderTop: `${toPx(1)} solid ${foregroundColor}`
            }
        },
        flipper_next: {
            "& $flipper_glyph": {
                transform: applyLocalizedProperty(eastFlipperTransform, westFlipperTransform, direction)
            }
        },
        flipper_previous: {
            "& $flipper_glyph": {
                transform: applyLocalizedProperty(westFlipperTransform, eastFlipperTransform, direction)
            }
        }
    };
};

export default styles;
