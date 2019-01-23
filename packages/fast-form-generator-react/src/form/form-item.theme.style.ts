import {
    accent,
    background000,
    foreground200,
    foreground300,
} from "./form.constants.style";
import {
    applyControl,
    applyControlWrapper,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    darkTheme,
    lightTheme,
} from "./form.utilities.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemThemeClassNameContract } from "../class-name-contracts/";

function applyThemeInputBackplateStyle(): CSSRules<{}> {
    return {
        appearance: "none",
        border: `2px solid ${foreground200}`,
        height: "20px",
        width: "20px",
        margin: "0",
        borderRadius: "2px",
        "&:checked, &:focus": {
            outline: "none",
            borderColor: accent,
        },
        "&:hover": {
            borderColor: background000,
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
        backgroundColor: foreground300,
    },
    formItemTheme_controlInput__dark: {
        ...applyThemeInputBackplateStyle(),
        background: darkTheme,
        backgroundColor: background000,
    },
    formItemTheme_softRemove: {
        ...applySoftRemove(),
    },
    formItemTheme_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
