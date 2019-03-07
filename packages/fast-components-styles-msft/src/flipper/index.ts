import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { FlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";

const eastFlipperTransform: string = "translateX(-3px) rotate(45deg)";
const westFlipperTransform: string = "translateX(3px) rotate(-135deg)";

const styles: ComponentStyles<FlipperClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<FlipperClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        flipper: {
            width: "40px",
            height: "40px",
            margin: "0",
            position: "relative",
            color: neutralForegroundRest,
            background: "transparent",
            border: `${toPx(designSystem.outlinePatternOutlineWidth)} solid transparent`,
            borderRadius: "50%",
            padding: "0",
            "&::before": {
                content: "''",
                top: "-1px",
                right: "-1px",
                bottom: "-1px",
                left: "-1px",
                opacity: "0.8",
                background: neutralFillStealthRest,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralOutlineRest(designSystem)}`,
                borderRadius: "50%",
                position: "absolute",
            },
            "&:hover": {
                color: neutralForegroundHover,
                "&::before": {
                    background: neutralFillStealthHover,
                    border: `${toPx(
                        designSystem.outlinePatternOutlineWidth
                    )} solid ${neutralOutlineHover(designSystem)}`,
                },
                "& $flipper_glyph": {
                    "&::before": {
                        borderRightColor: neutralForegroundRest,
                        borderTopColor: neutralForegroundRest,
                    },
                },
            },
            "&:active": {
                color: neutralForegroundActive,
                "&::before": {
                    background: neutralFillStealthActive,
                    border: `${toPx(
                        designSystem.outlinePatternOutlineWidth
                    )} solid ${neutralOutlineActive(designSystem)}`,
                },
            },
            ...applyFocusVisible({
                "&::before": {
                    boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
                    border: `${toPx(
                        designSystem.outlinePatternOutlineWidth
                    )} solid ${neutralFocus(designSystem)}`,
                },
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
                borderRight: `1px solid ${neutralForegroundRest(designSystem)}`,
                borderTop: `1px solid ${neutralForegroundRest(designSystem)}`,
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
