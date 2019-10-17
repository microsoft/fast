import { DesignSystem } from "../design-system";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import {
    HighContrastColor,
    highContrastLinkValue,
    highContrastOptOutProperty,
    highContrastSelector,
} from "../utilities/high-contrast";

const styles: ComponentStyles<HypertextClassNameContract, DesignSystem> = {
    hypertext: {
        outline: "none",
        "text-decoration": "none",
        color: neutralForegroundRest,
        transition: "all 0.2s ease-in-out, border 0.03s ease-in-out",
        "&:link, &:visited": {
            "border-bottom": format<DesignSystem>(
                "{0} solid {1}",
                toPx(outlineWidth),
                accentForegroundRest
            ),
            color: accentForegroundRest,
            "&:hover": {
                "border-bottom": format<DesignSystem>(
                    "{0} solid {1}",
                    toPx(outlineWidth),
                    accentForegroundHover
                ),
                color: accentForegroundHover,
                [highContrastSelector]: {
                    "border-bottom": format<DesignSystem>(
                        "{0} solid {1}",
                        toPx(focusOutlineWidth),
                        () => highContrastLinkValue
                    ),
                    color: highContrastLinkValue,
                },
            },
            "&:active": {
                "border-bottom": format<DesignSystem>(
                    "{0} solid {1}",
                    toPx(outlineWidth),
                    accentForegroundActive
                ),
                color: accentForegroundActive,
            },
            ...applyFocusVisible({
                "border-bottom": format<DesignSystem>(
                    "{0} solid {1}",
                    toPx(focusOutlineWidth),
                    neutralFocus
                ),
                [highContrastSelector]: {
                    "border-bottom": format<DesignSystem>(
                        "{0} solid {1}",
                        toPx(focusOutlineWidth),
                        () => highContrastLinkValue
                    ),
                    color: highContrastLinkValue,
                },
            }),
            [highContrastSelector]: {
                "border-bottom": format<DesignSystem>(
                    "{0} solid {1}",
                    toPx(outlineWidth),
                    () => highContrastLinkValue
                ),
                color: highContrastLinkValue,
            },
        },
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
            color: HighContrastColor.text,
        },
    },
};

export default styles;
