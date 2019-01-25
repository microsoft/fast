import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { FlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
} from "@microsoft/fast-jss-utilities";
import {
    applyMixedColor,
    ensureNormalContrast,
    hoverContrast,
    normalContrast,
} from "../utilities/colors";
import { get } from "lodash-es";
import outlinePattern from "../patterns/outline";

const eastFlipperTransform: string = "translateX(-3px) rotate(45deg)";
const westFlipperTransform: string = "translateX(3px) rotate(-135deg)";

const styles: ComponentStyles<FlipperClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<FlipperClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);

    const backgroundColor: string = designSystem.backgroundColor;
    const direction: Direction = designSystem.direction;
    const foregroundColor: string = ensureNormalContrast(
        designSystem.contrast,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );

    const glyphColorHover: string = hoverContrast(config.contrast, foregroundColor);

    return {
        flipper: {
            width: "40px",
            height: "40px",
            margin: "0",
            color: foregroundColor,
            ...outlinePattern.rest,
            borderRadius: "50%",
            padding: "0",
            "&:hover": {
                ...outlinePattern.hover,
                "& $flipper_glyph": {
                    "&::before": {
                        borderRightColor: glyphColorHover,
                        borderTopColor: glyphColorHover,
                    },
                },
            },
            ...applyFocusVisible({
                ...outlinePattern.focus,
            }),
            "&::-moz-focus-inner": {
                border: "0",
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
