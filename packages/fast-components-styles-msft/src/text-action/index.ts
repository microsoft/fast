import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
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
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const textFieldOverrides: ComponentStyles<
    Partial<TextFieldClassNameContract>,
    DesignSystem
> = {
    textField: {
        height: "calc(100% - 2px)",
        margin: "1px",
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
        height: "16px",
        width: "auto",
        marginTop: "8px",
        margin: "auto",
        fill: neutralForegroundRest,
    };

    return {
        textAction: {
            boxSizing: "border-box",
            position: "relative",
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            margin: "0",
            minWidth: "92px",
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralOutlineRest(designSystem)}`,
            background: neutralFillInputRest,
            borderRadius: toPx(designSystem.cornerRadius),
            display: "flex",
            flexDirection: "row",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
                background: neutralFillInputHover,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralOutlineHover(designSystem)}`,
            },
            "&:active": {
                background: neutralFillInputActive,
                border: `${toPx(
                    designSystem.outlinePatternOutlineWidth
                )} solid ${neutralOutlineActive(designSystem)}`,
            },
        },
        textAction__focus: {
            boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralFocus(designSystem)}`,
            "&:hover": {
                boxShadow: `0 0 0 1px ${designSystem.foregroundColor} inset`,
                border: `${toPx(designSystem.outlinePatternOutlineWidth)} solid ${
                    designSystem.foregroundColor
                }`,
            },
        },
        textAction__disabled: {
            cursor: "not-allowed",
            opacity: "0.3",
        },
        textAction_button: {
            borderColor: "transparent",
            height: `calc(${density(defaultHeight)(designSystem)} - 6px)`,
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            minWidth: "fit-content",
            margin: "2px",
            padding: "0 16px",
            [applyLocalizedProperty("right", "left", direction)]: "0",
            top: "0",
            transition: "color .1s, background-color .1s, border-color 0.2s ease-in-out",
            flex: "0 0 auto",
            cursor: "pointer",
        },
        textAction_beforeGlyph: {
            ...glyphStyles,
            [applyLocalizedProperty("marginLeft", "marginRight", direction)]: "8px",
        },
        textAction_afterGlyph: {
            ...glyphStyles,
            [applyLocalizedProperty("marginRight", "marginLeft", direction)]: "8px",
        },
    };
};

export default styles;
