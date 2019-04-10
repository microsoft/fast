import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyFocusVisible, format } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyles<HypertextClassNameContract, DesignSystem> = {
    hypertext: {
        outline: "none",
        textDecoration: "none",
        color: neutralForegroundRest,
        transition: "all 0.2s ease-in-out, border 0.03s ease-in-out",
        "&:link, &:visited": {
            borderBottom: format<DesignSystem>("1px solid {0}", accentForegroundRest),
            color: accentForegroundRest,
            "&:hover": {
                borderBottom: format<DesignSystem>(
                    "2px solid {0}",
                    accentForegroundHover
                ),
                color: accentForegroundHover,
            },
            "&:active": {
                borderBottom: format<DesignSystem>(
                    "2px solid {0}",
                    accentForegroundActive
                ),
                color: accentForegroundActive,
            },
            ...applyFocusVisible({
                borderBottom: format<DesignSystem>("2px solid {0}", neutralFocus),
            }),
        },
    },
};

export default styles;
