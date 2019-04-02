import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { FlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyFocusVisible, Direction, toPx } from "@microsoft/fast-jss-utilities";
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
import { glyphSize, height } from "../utilities/density";

const styles: ComponentStyles<FlipperClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<FlipperClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        flipper: {
            width: height(),
            height: height(),
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0",
            position: "relative",
            fill: neutralForegroundRest,
            color: neutralForegroundRest,
            background: "transparent",
            border: "none",
            padding: "0",
            "&::before": {
                transition: "all 0.1s ease-in-out",
                content: "''",
                opacity: "0.8",
                background: neutralFillStealthRest,
                border: `${toPx(designSystem.outlineWidth)} solid ${neutralOutlineRest(
                    designSystem
                )}`,
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
            position: "relative",
            width: glyphSize,
            height: glyphSize,
        },
        flipper__next: {},
        flipper__previous: {},
    };
};

export default styles;
