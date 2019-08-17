import { applyCursorDefault, applyCursorPointer } from "../utilities/cursor";
import { SelectOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    directionSwitch,
    ellipsis,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStealthSelected,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { designUnit, focusOutlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import {
    highContrastDisabledBorder,
    highContrastSelection,
    highContrastSelector,
    highContrastStealth,
} from "../utilities/high-contrast";

const styles: ComponentStyles<SelectOptionClassNameContract, DesignSystem> = {
    selectOption: {
        listStyleType: "none",
        boxSizing: "border-box",
        height: height(),
        display: "flex",
        alignItems: "center",
        padding: format("0 {0}", horizontalSpacing(focusOutlineWidth)),
        margin: format("0 {0}", toPx(designUnit)),
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        whiteSpace: "nowrap",
        overflow: "hidden",
        ...applyCursorDefault(),
        ...applyScaledTypeRamp("t7"),
        background: neutralFillStealthRest,
        ...applyCursorPointer(),
        ...applyCornerRadius(),
        ...applyFocusPlaceholderBorder(),
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
        }),
        "&:hover": {
            background: neutralFillStealthHover,
            ...highContrastSelection,
        },
        ...highContrastStealth,
    },
    selectOption_contentRegion: {
        overflow: "hidden",
        ...ellipsis(),
    },
    selectOption_glyph: {
        display: "inline-block",
        position: "relative",
        width: glyphSize,
        height: glyphSize,
        flexShrink: "0",
        margin: directionSwitch(
            format("0 {0} 0 0", horizontalSpacing()),
            format("0 0 0 {0}", horizontalSpacing())
        ),
    },
    selectOption__disabled: {
        ...applyDisabledState(),
        ...highContrastDisabledBorder,
        "&, &:hover": {
            background: neutralFillStealthRest,
        },
    },
    selectOption__selected: {
        [highContrastSelector]: {
            background: "Highlight !important",
            borderColor: "ButtonText !important",
            color: "HighlightText !important",
            fill: "HighlightText !important",
        },
        background: neutralFillStealthSelected,
        "&:hover": {
            background: neutralFillStealthSelected,
        },
    },
};

export default styles;
