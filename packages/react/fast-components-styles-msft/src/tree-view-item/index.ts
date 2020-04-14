import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { TreeViewItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    add,
    applyFocusVisible,
    directionSwitch,
    divide,
    format,
    multiply,
    subtract,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import {
    accentForegroundRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { heightNumber } from "../utilities/density";
import { designUnit, focusOutlineWidth } from "../utilities/design-system";
import {
    HighContrastColor,
    highContrastDoubleFocus,
    highContrastOptOutProperty,
    highContrastSelected,
    highContrastSelectedBackground,
    highContrastSelector,
} from "../utilities/high-contrast";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorPointer } from "../utilities/cursor";
import {
    glyphSize,
    glyphSizeNumber,
    height,
    horizontalSpacing,
} from "../utilities/density";
import {
    applyScaledLineHeight,
    applyScaledTypeRamp,
    getScaledLineHeight,
} from "../utilities/typography";
import { applyFontWeightNormal } from "../utilities/fonts";

const styles: ComponentStyles<TreeViewItemClassNameContract, DesignSystem> = {
    // Container for item AND any children
    treeViewItem: {
        position: "relative",
        color: neutralForegroundRest,
        background: neutralFillStealthRest,
        ...applyCursorPointer(),
        // TODO: #1350 applyFocusVisible can only handle a single selector rule
        ...applyFocusVisible<DesignSystem>(" > $treeViewItem_contentRegion", {
            border: format<DesignSystem>(
                "{0} solid {1}",
                toPx(focusOutlineWidth),
                neutralFocus
            ),
            ...highContrastDoubleFocus,
        }),
        "& $treeViewItem_beforeContent, & $treeViewItem_afterContent": {
            width: glyphSize,
            height: glyphSize,
            fill: neutralForegroundRest,
            [highContrastSelector]: {
                fill: HighContrastColor.buttonText,
            },
        },
    },
    treeViewItem_beforeContent: {
        "margin-right": directionSwitch(horizontalSpacing(), ""),
        "margin-left": directionSwitch("", horizontalSpacing()),
    },
    treeViewItem_afterContent: {
        "margin-left": directionSwitch(horizontalSpacing(), ""),
        "margin-right": directionSwitch("", horizontalSpacing()),
    },
    // Single item container, always full width
    treeViewItem_contentRegion: {
        display: "flex",
        position: "relative",
        "box-sizing": "border-box",
        height: height(),
        ...applyFocusPlaceholderBorder(),
        ...applyCornerRadius(),
        "&:hover": {
            background: neutralFillStealthHover,
            ...highContrastSelected,
            [`& $treeViewItem_expandCollapseGlyph,
            & $treeViewItem_beforeContent, & $treeViewItem_afterContent`]: {
                [highContrastSelector]: {
                    fill: HighContrastColor.selectedText,
                },
            },
        },
        "&:active": {
            background: neutralFillStealthActive,
        },
        // Left indent padding for node level; em size set in treeViewItem_childNodeRegion
        "&::before": {
            content: "''",
            display: "block",
            width: "0",
            "flex-shrink": "0",
        },
        [highContrastSelector]: {
            ...highContrastOptOutProperty,
            color: HighContrastColor.buttonText,
            border: format<DesignSystem>(
                "{0} solid transparent",
                toPx(focusOutlineWidth)
            ),
        },
    },
    // Single item container for expand/collapse button, glyph, and text; Indented for node level
    treeViewItem_innerContentRegion: {
        // Default margin for glyph and/or text, i.e. not nested
        "margin-left": directionSwitch(horizontalSpacing(focusOutlineWidth), ""),
        "margin-right": directionSwitch("", horizontalSpacing(focusOutlineWidth)),
        display: "flex",
        "align-items": "center",
        "white-space": "nowrap",
        ...applyScaledTypeRamp("t7"),
        ...applyFontWeightNormal(),
    },
    // Container for all child nodes of an item
    treeViewItem_childNodeRegion: {
        display: "none",
        "font-size": format<DesignSystem>(
            "calc(1em + {0})",
            toPx(add(designUnit, glyphSizeNumber))
        ),
        "& $treeViewItem_contentRegion": {
            "&::before": {
                width: "1em",
            },
        },
    },
    // Basic button style, more below under treeViewItem__nested
    treeViewItem_expandCollapseButton: {
        background: "none",
        border: "none",
        outline: "none",
        width: toPx(add(glyphSizeNumber, multiply(designUnit, 4))),
        height: toPx(add(glyphSizeNumber, multiply(designUnit, 4))),
        padding: "0",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        ...applyCursorPointer(),
    },
    treeViewItem_expandCollapseGlyph: {
        width: glyphSize,
        height: glyphSize,
        transition: "transform .1s linear",
        transform: directionSwitch("rotate(-45deg)", "rotate(135deg)"),
        "pointer-events": "none",
        fill: neutralForegroundRest,
        [highContrastSelector]: {
            fill: HighContrastColor.buttonText,
        },
    },
    treeViewItem__expanded: {
        "& > $treeViewItem_contentRegion $treeViewItem_expandCollapseGlyph": {
            transform: directionSwitch("rotate(0deg)", "rotate(90deg)"),
        },
        "& > $treeViewItem_childNodeRegion": {
            display: "block",
        },
    },
    treeViewItem__selected: {
        "& > $treeViewItem_contentRegion": {
            background: neutralFillStealthSelected,
            ...highContrastSelected,
        },
        "&::after": {
            content: "''",
            display: "block",
            position: "absolute",
            top: toPx(divide(subtract(heightNumber(), getScaledLineHeight("t7")), 2)),
            width: "3px",
            height: applyScaledLineHeight("t7"),
            background: accentForegroundRest(neutralFillStealthSelected),
            left: directionSwitch(toPx(focusOutlineWidth), "unset"),
            right: directionSwitch("unset", toPx(focusOutlineWidth)),
            ...applyCornerRadius(),
            ...highContrastSelectedBackground,
        },
        [`& > $treeViewItem_contentRegion $treeViewItem_beforeContent, & $treeViewItem_afterContent,
            & > $treeViewItem_contentRegion $treeViewItem_expandCollapseGlyph`]: {
            [highContrastSelector]: {
                fill: HighContrastColor.selectedText,
            },
        },
    },
    treeViewItem__nested: {
        "& $treeViewItem_innerContentRegion": {
            position: "relative",
            // Push every innerContentRegion over to hold space for the expand/collapse button, whether parent node or not
            "margin-left": directionSwitch(
                toPx(add(glyphSizeNumber, multiply(designUnit, 4))),
                ""
            ),
            "margin-right": directionSwitch(
                "",
                toPx(add(glyphSizeNumber, multiply(designUnit, 4)))
            ),
        },
        "& $treeViewItem_expandCollapseButton": {
            position: "absolute",
            // Bring the expand/collapse button back into the empty space
            left: directionSwitch(
                toPx(multiply(add(glyphSizeNumber, multiply(designUnit, 4)), -1)),
                ""
            ),
            right: directionSwitch(
                "",
                toPx(multiply(add(glyphSizeNumber, multiply(designUnit, 4)), -1))
            ),
        },
    },
};

export default styles;
