import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { FlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyLocalizedProperty,
    contrast,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    applyMixedColor,
    ensureNormalContrast,
    hoverContrast,
    normalContrast,
} from "../utilities/colors";
import { get } from "lodash-es";
import Chroma from "chroma-js";

const eastFlipperTransform: string = "translateX(-3px) rotate(45deg)";
const westFlipperTransform: string = "translateX(3px) rotate(-135deg)";

/* tslint:disable:max-line-length */
const styles: ComponentStyles<FlipperClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<FlipperClassNameContract, DesignSystem> => {
    /* tslint:enable:max-line-length */
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

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

    const borderColorHover: string = hoverContrast(
        config.contrast,
        borderColor,
        backgroundColor
    );
    const glyphColorHover: string = hoverContrast(
        config.contrast,
        foregroundColor,
        backgroundColor
    );

    return {
        flipper: {
            width: "40px",
            height: "40px",
            margin: "0",
            color: foregroundColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "50%",
            background: backgroundColor,
            padding: "0",
            "&:hover": {
                borderColor: borderColorHover,
                "& $flipper_glyph": {
                    "&::before": {
                        borderRightColor: glyphColorHover,
                        borderTopColor: glyphColorHover,
                    },
                },
            },
            "&:focus": {
                boxShadow: `0 0 0 1px inset ${borderColor}`,
                outline: "none",
            },
        },
        flipper_glyph: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: "14px",
            height: "14px",
            "&::before": {
                boxSizing: "border-box",
                height: "12px",
                width: "12px",
                content: '""',
                borderRight: `1px solid ${foregroundColor}`,
                borderTop: `1px solid ${foregroundColor}`,
            },
        },
        flipper__next: {
            "& $flipper_glyph": {
                transform: applyLocalizedProperty(
                    eastFlipperTransform,
                    westFlipperTransform,
                    direction
                ),
            },
        },
        flipper__previous: {
            "& $flipper_glyph": {
                transform: applyLocalizedProperty(
                    westFlipperTransform,
                    eastFlipperTransform,
                    direction
                ),
            },
        },
    };
};

export default styles;
