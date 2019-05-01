import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    applyLocalizedProperty,
    Direction,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
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
import { applyCornerRadius } from "../utilities/border";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { outlineWidth } from "../utilities/design-system";

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

/* tslint:disable:max-line-length */
const styles: ComponentStyles<TextActionClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<TextActionClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const glyphStyles: CSSRules<{}> = {
        width: glyphSize,
        height: glyphSize,
        margin: "auto",
        fill: neutralForegroundRest,
    };

    return {
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
                boxShadow: `0 0 0 ${toPx(
                    designSystem.focusOutlineWidth - designSystem.outlineWidth
                )} ${neutralFocus(designSystem)} inset`,
                border: `${toPx(designSystem.outlineWidth)} solid ${neutralFocus(
                    designSystem
                )}`,
            },
        },
        textAction__disabled: {
            ...applyDisabledState(designSystem),
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
            height: `calc(${height()(designSystem)} - 6px)`,
            minWidth: "fit-content",
            margin: "2px",
            padding: `0 5px`,
            [applyLocalizedProperty("right", "left", direction)]: "0",
            top: "0",
            transition: "color .1s, background-color .1s, border-color 0.2s ease-in-out",
            flex: "0 0 auto",
            cursor: "pointer",
        },
        textAction_beforeGlyph: {
            ...glyphStyles,
            [applyLocalizedProperty(
                "marginLeft",
                "marginRight",
                direction
            )]: horizontalSpacing(1)(designSystem),
        },
        textAction_afterGlyph: {
            ...glyphStyles,
            [applyLocalizedProperty(
                "marginRight",
                "marginLeft",
                direction
            )]: horizontalSpacing(1)(designSystem),
        },
    };
};

export default styles;
