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
            width: toPx(
                (designSystem.defaultHeightMultiplier + 2) * designSystem.designUnit
            ),
            height: toPx(
                (designSystem.defaultHeightMultiplier + 2) * designSystem.designUnit
            ),
            margin: "0",
            position: "relative",
            color: neutralForegroundRest,
            background: "transparent",
            border: "none",
            padding: "0",
            "&::before": {
                transition: "all 0.1s ease-in-out",
                content: "''",
                opacity: "0.8",
                background: neutralFillStealthRest,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralOutlineRest(designSystem)}`,
                borderRadius: "50%",
                position: "absolute",
                top: "0",
                right: "0",
                bottom: "0",
                left: "0",
            },
            "&:active": {
                "&::before": {
                    background: neutralFillStealthActive,
                    borderColor: neutralOutlineActive,
                },
            },
            "&:hover": {
                "&::before": {
                    background: neutralFillStealthHover,
                    borderColor: neutralOutlineHover,
                },
            },
            ...applyFocusVisible({
                "&::before": {
                    boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
                    border: neutralFocus,
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
