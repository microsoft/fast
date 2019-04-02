import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import {
    ButtonClassNameContract,
    CallToActionClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../design-system";
import { accentFillRest, accentForegroundCut } from "../utilities/color";
import { glyphSize } from "../utilities/density";

function applyContentRegionTransform(): CSSRules<DesignSystem> {
    return {
        transform: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string => {
                const translateXValue: string = toPx(designSystem.designUnit);
                return applyLocalizedProperty(
                    `translateX(-${translateXValue})`,
                    `translateX(${translateXValue})`,
                    designSystem.direction
                );
            }
        ),
    };
}

function applyGlyphTransform(): CSSRules<DesignSystem> {
    return {
        transform: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string => {
                const translateXValue: string = toPx(designSystem.designUnit);
                return applyLocalizedProperty(
                    `translateX(${translateXValue})`,
                    `rotate(180deg) translateX(${translateXValue})`,
                    designSystem.direction
                );
            }
        ),
        position: "relative",
    };
}

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const callToActionButtonOverrides: ComponentStyles<
    Partial<ButtonClassNameContract>,
    DesignSystem
> = {
    button: {
        maxWidth: "100%",
    },
    button_contentRegion: {
        transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
    },
    button__primary: {
        "&:hover": {
            "& $button_contentRegion": {
                ...applyContentRegionTransform(),
            },
        },
    },
    button__lightweight: {
        "&:hover": {
            "& $button_contentRegion": {
                ...applyContentRegionTransform(),
            },
        },
    },
    button__disabled: {
        "&:hover": {
            "& $button_contentRegion": {
                transform: "none",
            },
        },
    },
};

const styles: ComponentStyles<CallToActionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<CallToActionClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const translateXValue: string = toPx(designSystem.designUnit);

    return {
        callToAction: {
            transition: "all 0.2s ease-in-out",
            display: "inline-flex",
            maxWidth: "100%",
            lineHeight: "1",
            textDecoration: "none",
            whiteSpace: "nowrap",
            "&:hover": {
                "& $callToAction_glyph": {
                    ...applyGlyphTransform(),
                },
            },
            ...applyFocusVisible("& $callToAction_glyph", {
                ...applyGlyphTransform(),
            }),
        },
        callToAction_glyph: {
            fill: accentForegroundCut,
            display: "inline-block",
            position: "relative",
            width: glyphSize,
            height: glyphSize,
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "6px",
            transform: direction === Direction.ltr ? "none" : "rotate(180deg)",
            transition: "all 600ms cubic-bezier(0.19, 1, 0.22, 1)",
        },
        callToAction__primary: {
            "& $callToAction_glyph": {
                fill: accentForegroundCut,
            },
        },
        callToAction__lightweight: {
            "& $callToAction_glyph": {
                fill: accentFillRest,
            },
        },
        callToAction__justified: {
            [applyLocalizedProperty(
                "paddingRight",
                "paddingLeft",
                direction
            )]: translateXValue,
            "& $callToAction_glyph": {
                fill: accentFillRest,
            },
        },
        callToAction__disabled: {
            "&:hover": {
                "& $callToAction_glyph": {
                    transform: "none",
                },
            },
        },
    };
};

export default styles;
