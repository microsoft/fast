import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { DesignSystem } from "../design-system";
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
                "border-bottom-color": accentForegroundHover,
                color: accentForegroundHover,
                [highContrastSelector]: {
                    "border-bottom-color": highContrastLinkValue,
                    color: highContrastLinkValue,
                },
            },
            "&:active": {
                "border-bottom-color": accentForegroundActive,
                color: accentForegroundActive,
            },
            ...applyFocusVisible({
                "border-bottom": format<DesignSystem>(
                    "{0} solid {1}",
                    toPx(focusOutlineWidth),
                    neutralFocus
                ),
                [highContrastSelector]: {
                    "border-bottom-color": highContrastLinkValue,
                    color: highContrastLinkValue,
                },
            }),
            [highContrastSelector]: {
                color: highContrastLinkValue,
                "border-bottom-color": highContrastLinkValue,
            },
        },
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
            color: HighContrastColor.text,
        },
    },
};

export default styles;
