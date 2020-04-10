import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { directionSwitch } from "@microsoft/fast-jss-utilities";
import { BreadcrumbClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { neutralForegroundHint, neutralForegroundRest } from "../utilities/color";
import { DesignSystem } from "../design-system";
import { applyCursorDefault } from "../utilities/cursor";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<BreadcrumbClassNameContract, DesignSystem> = {
    breadcrumb: {
        color: neutralForegroundRest,
        ...applyScaledTypeRamp("t7"),
        ...applyCursorDefault(),
    },
    breadcrumb_item: {
        display: "inline",
        outline: "none",
        "text-decoration": "none",
        transition: "all 0.2s ease-in-out, border none",
        "&:link, &:visited": {
            "border-bottom": "0px",
        },
    },
    breadcrumb_itemsContainer: {
        "list-style": "none",
        "padding-left": directionSwitch("0", ""),
        "padding-right": directionSwitch("", "0"),
        margin: "0",
        display: "flex",
        "flex-wrap": "wrap",
    },
    breadcrumb_separator: {
        display: "inline-block",
        ...applyCursorDefault(),
        color: neutralForegroundHint,
        margin: "0 6px",
    },
};

export default styles;
