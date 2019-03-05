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
            color: neutralForegroundRest,
            background: neutralFillStealthRest,
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralOutlineRest(designSystem)}`,
            borderRadius: "50%",
            padding: "0",
            "&:hover": {
                background: neutralFillStealthHover,
                color: neutralForegroundHover,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralOutlineHover(designSystem)}`,
                "& $flipper_glyph": {
                    "&::before": {
                        borderRightColor: neutralForegroundRest,
                        borderTopColor: neutralForegroundRest,
                    },
                },
            },
            "&:active": {
                background: neutralFillStealthActive,
                color: neutralForegroundActive,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralOutlineActive(designSystem)}`,
            },
            ...applyFocusVisible({
                boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralFocus(designSystem)}`,
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
