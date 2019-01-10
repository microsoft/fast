import {
    applyControl,
    applyControlWrapper,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    colors,
    darkTheme,
    lightTheme,
} from "../utilities/";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemThemeClassNameContract } from "../class-name-contracts/";

function applyThemeInputBackplateStyle(): CSSRules<{}> {
    return {
        appearance: "none",
        border: `2px solid ${colors.foreground200}`,
        height: "20px",
        width: "20px",
        margin: "0",
        borderRadius: "2px",
        "&:checked, &:focus": {
            outline: "none",
            borderColor: colors.pink,
        },
        "&:hover": {
            borderColor: colors.background000,
        },
    };
}

const styles: ComponentStyles<FormItemThemeClassNameContract, {}> = {
    formItemTheme: {
        display: "flex",
        ...applyControlWrapper(),
    },
    formItemTheme_control: {
        ...applyControl(),
    },
    formItemTheme_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemTheme_controlInputContainer: {},
    formItemTheme_controlInput__light: {
        ...applyThemeInputBackplateStyle(),
        background: lightTheme,
        backgroundColor: colors.foreground300,
    },
    formItemTheme_controlInput__dark: {
        ...applyThemeInputBackplateStyle(),
        background: darkTheme,
        backgroundColor: colors.background000,
    },
    formItemTheme_softRemove: {
        ...applySoftRemove(),
    },
    formItemTheme_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
