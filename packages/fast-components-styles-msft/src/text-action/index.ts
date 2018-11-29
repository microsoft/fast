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
    ensureNormalContrast,
    hoverContrast,
    normalContrast,
} from "../utilities/colors";

// Override
export const textFieldOverrides: ComponentStyles<
    Partial<TextFieldClassNameContract>,
    DesignSystem
> = {
    textField: {
        width: "100%",
        height: "100%",
        marginTop: "0",
    },
};

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
        position: "absolute",
        height: "34px",
        width: "34px",
    };

    return {
        textAction: {
            position: "relative",
            height: "38px",
            marginTop: "20px",
            maxWidth: "296px",
            minWidth: "92px",
        },
        textAction_button: {
            border: "0",
            height: "34px",
            margin: "2px 2px 1px",
            padding: "9px",
            position: "absolute",
            right: "0",
            top: "0",
            transition: "color .1s,background-color .1s",
            width: "34px",
        },
        textAction_beforeGlyph: {
            ...glyphStyles,
        },
        textAction_afterGlyph: {
            ...glyphStyles,
        },
    };
};

export default styles;
