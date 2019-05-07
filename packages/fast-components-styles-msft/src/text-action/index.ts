import {
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { directionSwitch, format, subtract, toPx } from "@microsoft/fast-jss-utilities";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { applyCornerRadius } from "../utilities/border";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import {} from "lodash-es";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const textFieldOverrides: ComponentStyles<
    Partial<TextFieldClassNameContract>,
    DesignSystem
> = {
    textField: {
        height: "calc(100% - 4px)",
        margin: "2px 1px",
        border: "none",
        flex: "1 0 0",
        background: "transparent",
        minWidth: "inherit",
        "&:hover, &:disabled, &:active, &:focus": {
            border: "none",
            boxShadow: "none",
        },
    },
};

const glyphStyles: CSSRules<{}> = {
    width: glyphSize,
    height: glyphSize,
    margin: "auto",
    fill: neutralForegroundRest,
};

const styles: ComponentStyles<TextActionClassNameContract, DesignSystem> = {
    textAction: {
        boxSizing: "border-box",
        position: "relative",
        height: height(),
        margin: "0",
        minWidth: "92px",
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        background: neutralFillInputRest,
        ...applyCornerRadius(),
        display: "flex",
        flexDirection: "row",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            background: neutralFillInputHover,
            borderColor: neutralOutlineHover,
        },
        "&:active": {
            background: neutralFillInputActive,
            borderColor: neutralOutlineActive,
        },
    },
    textAction__focus: {
        "&, &:hover": {
            boxShadow: format(
                "0 0 0 {0} {1} inset",
                toPx(subtract(focusOutlineWidth, outlineWidth)),
                neutralFocus
            ),
            border: format("{0} solid {1}", toPx(outlineWidth), neutralFocus),
        },
    },
    textAction__disabled: {
        ...applyDisabledState(),
        "&:hover": {
            background: neutralFillInputRest,
            borderColor: neutralOutlineRest,
        },
        "&:active": {
            background: neutralFillInputRest,
            borderColor: neutralOutlineRest,
        },
    },
    textAction_button: {
        borderColor: "transparent",
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        height: format("calc({0} - 6px)", height()),
        minWidth: "fit-content",
        margin: "2px",
        padding: `0 5px`,
        left: directionSwitch("0", ""),
        right: directionSwitch("", "0"),
        top: "0",
        transition: "color .1s, background-color .1s, border-color 0.2s ease-in-out",
        flex: "0 0 auto",
        cursor: "pointer",
    },
    textAction_beforeGlyph: {
        ...glyphStyles,
        marginLeft: directionSwitch(horizontalSpacing(1), ""),
        marginRight: directionSwitch("", horizontalSpacing(1)),
    },
    textAction_afterGlyph: {
        ...glyphStyles,
        marginLeft: directionSwitch(horizontalSpacing(1), ""),
        marginRight: directionSwitch("", horizontalSpacing(1)),
    },
};

export default styles;
