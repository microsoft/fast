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
    applyMixedColor,
    disabledContrast,
    ensureNormalContrast,
    ensuresBackgroundNormal,
    foregroundNormal,
    hoverContrast,
    normalContrast,
} from "../utilities/colors";
import { density } from "../utilities/density";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
import outlinePattern from "../patterns/outline";

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const textFieldOverrides: ComponentStyles<
    Partial<TextFieldClassNameContract>,
    DesignSystem
> = {
    textField: {
        height: "100%",
        border: "none",
        flex: "1 0 0",
        background: "transparent",
        minWidth: "inherit",
        "&:hover, &:disabled": {
            border: "none",
            boxShadow: "none",
        },
        ...applyFocusVisible({
            border: "none",
            boxShadow: "none",
        }),
    },
};

/**
 * Retrieves the disabled color
 */
function disabledColor(config: DesignSystem): string {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return disabledContrast(
        designSystem.contrast,
        foregroundNormal(designSystem),
        designSystem.backgroundColor
    );
}

function hoverColor(config: DesignSystem): string {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    return hoverContrast(
        designSystem.contrast,
        foregroundNormal(designSystem),
        designSystem.backgroundColor
    );
}

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
        fill: designSystem.foregroundColor,
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
            ...outlinePattern.rest,
            background: ensuresBackgroundNormal,
            borderRadius: toPx(designSystem.cornerRadius),
            display: "flex",
            flexDirection: "row",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
                ...outlinePattern.hover,
            },
        },
        textAction__focus: {
            outline: "none",
            ...outlinePattern.focus,
        },
        textAction__disabled: {
            borderColor: disabledColor(designSystem),
            color: disabledColor(designSystem),
            cursor: "not-allowed",
            "&:hover": {
                borderColor: disabledColor(designSystem),
            },
            "& $textAction_beforeGlyph, & $textAction_afterGlyph": {
                opacity: ".5",
            },
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
