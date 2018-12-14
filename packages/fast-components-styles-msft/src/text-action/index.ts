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
    contrast,
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

// Since MSFT button is already styled, we need to override in this way to alter button classes
export const textFieldOverrides: ComponentStyles<
    Partial<TextFieldClassNameContract>,
    DesignSystem
> = {
    textField: {
        height: "100%",
        marginTop: "0",
        border: "none",
        flex: "1 0 0",
        background: "transparent",
        "&:hover, &:focus, &:disabled": {
            borderColor: "transparent",
            boxShadow: "none",
        },
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
    const backgroundColor: string = designSystem.backgroundColor;
    const direction: Direction = designSystem.direction;
    const foregroundColor: string = ensureNormalContrast(
        designSystem.contrast,
        designSystem.foregroundColor,
        designSystem.backgroundColor
    );

    const glyphStyles: CSSRules<{}> = {
        height: "16px",
        width: "auto",
        marginTop: "8px",
        margin: "auto",
    };

    return {
        textAction: {
            position: "relative",
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            margin: `${density(designSystem.designUnit * 3)(designSystem)} 0`,
            minWidth: "92px",
            border: `1px solid ${foregroundNormal(designSystem)}`,
            background: ensuresBackgroundNormal,
            borderRadius: "2px",
            display: "flex",
            flexDirection: "row",
            "&:hover": {
                borderColor: hoverColor(designSystem),
            },
            "&:focus-within": {
                outline: "none",
                boxShadow: `0 0 0 1px inset ${foregroundNormal(designSystem)}`,
            },
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
            height: `calc(${density(defaultHeight)(designSystem)} - 4px)`,
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            minWidth: "fit-content",
            margin: "2px",
            padding: "0 16px",
            [applyLocalizedProperty("right", "left", direction)]: "0",
            top: "0",
            transition: "color .1s, background-color .1s",
            flex: "0 0 auto",
            cursor: "pointer",
            "&:focus-visible": {
                borderColor: "transparent",
            },
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
