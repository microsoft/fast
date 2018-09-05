import { ComponentStyles, ComponentStyleSheet, ICSSRules } from "@microsoft/fast-jss-manager";
import { ICallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { applyLocalizedProperty, Direction, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import { IDesignSystem, withDesignSystemDefaults } from "../design-system/index";
import { curry } from "lodash-es";
import {
    ensureNormalContrast,
    hoverContrast,
    normalContrast,
} from "../utilities/colors";

const styles: ComponentStyles<ICallToActionClassNameContract, IDesignSystem> = (
    config: IDesignSystem
): ComponentStyleSheet<ICallToActionClassNameContract, IDesignSystem> => {
    type ContrastFunction = (operandColor: string, referenceColor: string) => string;
    // tslint:disable:max-line-length
    const ctaCaratRightBlue: string = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii00MDE0LjQgMTYxNi45OTggNC40IDgiPjxkZWZzPjxzdHlsZT4uYXtmaWxsOiMwMDc4RDQ7fTwvc3R5bGU+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MTI4IDE2MDAuNjk4KSI+PHBhdGggY2xhc3M9ImEiIGQ9Ik0xNDAuNiwyMy45bDMuNy0zLjYtMy43LTMuNi40LS40LDQsNC00LDRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjcpIi8+PC9nPjwvc3ZnPg==)";
    const ctaCaratLeftBlue: string = "url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQuNCA4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0LjQgODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LnN0MHtmaWxsOiMwMDc4RDQ7fTwvc3R5bGU+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQxMjggMTYwMC42OTgpIj48cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDEzMi40LTE2MDAuM2wtMy43LDMuNmwzLjcsMy42bC0wLjQsMC40bC00LTRsNC00TDQxMzIuNC0xNjAwLjN6Ii8+PC9nPjwvc3ZnPg==)";
    const ctaCaratRightWhite: string = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii00MDE0LjQgMTYxNi45OTggNC40IDgiPjxkZWZzPjxzdHlsZT4uYXtmaWxsOiNGRkZGRkY7fTwvc3R5bGU+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MTI4IDE2MDAuNjk4KSI+PHBhdGggY2xhc3M9ImEiIGQ9Ik0xNDAuNiwyMy45bDMuNy0zLjYtMy43LTMuNi40LS40LDQsNC00LDRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjcpIi8+PC9nPjwvc3ZnPg==)";
    const ctaCaratLeftWhite: string = "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNC40IDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQuNCA4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0ZGRkZGRjt9PC9zdHlsZT48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDEyOCAxNjAwLjY5OCkiPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MTMyLjQtMTYwMC4zbC0zLjcsMy42bDMuNywzLjZsLTAuNCwwLjRsLTQtNGw0LTRMNDEzMi40LTE2MDAuM3oiLz48L2c+PC9zdmc+)";
    // tslint:enable:max-line-length
    const designSystem: IDesignSystem = withDesignSystemDefaults(config);
    const contrastScale: number = designSystem.contrast;
    const foregroundColor: string = designSystem.foregroundColor;
    const backgroundColor: string = designSystem.backgroundColor;
    const brandColor: string = designSystem.brandColor;
    const direction: Direction = designSystem.direction;
    const scaledNormalContrast: ContrastFunction = curry(normalContrast)(contrastScale);
    const scaledEnsureNormalContrast: ContrastFunction = curry(ensureNormalContrast)(contrastScale);
    const animationProperties: string = "cubic-bezier(0.19, 1, 0.22, 1)";

    const color: string = "white";
    const secondaryBackgroundColor: string = scaledEnsureNormalContrast(
        scaledNormalContrast(backgroundColor, foregroundColor),
        color
    );
    const secondaryHoverBackgroundColor: string = hoverContrast(
        designSystem.contrast,
        secondaryBackgroundColor,
        color
    );
    const secondaryFocusBorderColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(foregroundColor, backgroundColor),
        secondaryBackgroundColor
    );

    const primaryRestBackgroundColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(brandColor, backgroundColor),
        color
    );

    const primaryHoverBackground: string = hoverContrast(
        designSystem.contrast,
        primaryRestBackgroundColor,
        color
    );
    const primaryFocusBorderColor: string = scaledEnsureNormalContrast(
        scaledEnsureNormalContrast(foregroundColor, backgroundColor),
        primaryRestBackgroundColor
    );

    return {
        hypertext: {
            fontSize: "15px",
            display: "inline-block",
            maxWidth: "100%",
            border: "2px solid transparent",
            padding: localizeSpacing(direction)("13px 22px 11px 24px"),
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "-10px",
            lineHeight: "1",
            textDecoration: "none",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
            marginTop: "16px",
            transition: "all 0.2s ease-in-out",
            "& $callToAction_span, &::after": {
                position: "relative"
            },
            "&::after": {
                display: "inline-block",
                position: "relative",
                width: "8px",
                [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "6px",
                marginTop: "1px",
                content: direction === Direction.ltr ? ctaCaratRightWhite : ctaCaratLeftWhite,
                verticalAlign: "top",
                animation: {
                    name: "cta-glyph-move-in",
                    duration: "600ms",
                    timingFunction: animationProperties
                }
            },
            "&:hover, &:focus": {
                outline: "none",
                "&::after": {
                    animation: {
                        name: "cta-glyph-move-out",
                        duration: "600ms",
                        timingFunction: animationProperties,
                        fillMode: "forwards"
                    }
                },
                "& $callToAction_span": {
                    animation: {
                        name: "cta-text-move-out",
                        duration: "600ms",
                        timingFunction: animationProperties,
                        fillMode: "forwards"
                    }
                }
            }
        },
        callToAction_span: {
            display: "inline",
            maxWidth: "100%",
            textOverflow: "clip",
            overflow: "hidden",
            animation: {
                name: "cta-text-move-in",
                duration: "600ms",
                timingFunction: animationProperties
            }
        },
        callToAction_primary: {
            background: primaryRestBackgroundColor,
            color,
            "&:hover, &:focus": {
                background: primaryHoverBackground
            },
            "&:focus": {
                borderColor: primaryFocusBorderColor
            }
        },
        callToAction_secondary: {
            background: secondaryBackgroundColor,
            color,
            "&:hover": {
                background: secondaryHoverBackgroundColor
            },
            "&:focus": {
                borderColor: secondaryFocusBorderColor
            }
        },
        callToAction_lightweight: {
            background: "transparent",
            color: primaryRestBackgroundColor,
            "& $callToAction_span": {
                animation: "none",
                "&::before": {
                    background: primaryRestBackgroundColor,
                    content: "\"\"",
                    display: "none",
                    height: "2px",
                    position: "absolute",
                    bottom: "-2px",
                    width: "100%",
                    [applyLocalizedProperty("left", "right", direction)]: "0",
                }
            },
            "&:hover, &:focus": {
                "& $callToAction_span": {
                    animation: "none",
                    "&::before": {
                        display: "block",
                    }
                }
            },
            "&::after": {
                content: direction === Direction.ltr ? ctaCaratRightBlue : ctaCaratLeftBlue,
            }
        },
        "@keyframes cta-glyph-move-out": {
            "0%": {
                [applyLocalizedProperty("left", "right", direction)]: "0"
            },
            "100%": {
                [applyLocalizedProperty("left", "right", direction)]: "4px"
            }
        },
        "@keyframes cta-glyph-move-in": {
            "0%": {
                [applyLocalizedProperty("left", "right", direction)]: "4px"
            },
            "100%": {
                [applyLocalizedProperty("left", "right", direction)]: "0"
            }
        },
        "@keyframes cta-text-move-in": {
            "0%": {
                [applyLocalizedProperty("right", "left", direction)]: "4px"
            },
            "100%": {
                [applyLocalizedProperty("right", "left", direction)]: "0"
            }
        },
        "@keyframes cta-text-move-out": {
            "0%": {
                [applyLocalizedProperty("right", "left", direction)]: "0"
            },
            "100%": {
                [applyLocalizedProperty("right", "left", direction)]: "4px"
            }
        }
    };
};

export default styles;
