import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyInputContainerStyle,
    applyInputStyle,
    applyLabelStyle,
    applyWrapperStyle,
    colors,
    darkTheme,
    lightTheme
} from "../utilities/form-input.style";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { FormItemThemeClassNameContract } from "../class-name-contracts/";

function applyThemeInputBackplateStyle(): CSSRules<{}> {
    return {
        appearance: "none",
        border: `${toPx(2)} solid ${colors.containerBackground}`,
        height: toPx(36),
        width: toPx(36),
        margin: toPx(0),
        borderRadius: toPx(2),
        "&:checked, &:focus": {
            outline: "none",
            borderColor: colors.pink
        },
        "&:hover": {
            borderColor: colors.black
        }
    };
}

const styles: ComponentStyles<FormItemThemeClassNameContract, {}> = {
    formItemTheme: {
        ...applyWrapperStyle()
    },
    formItemTheme_label: {
        ...applyLabelStyle()
    },
    formItemTheme_inputContainer: {
        ...applyInputContainerStyle()
    },
    formItemTheme_input__light: {
        ...applyThemeInputBackplateStyle(),
        background: lightTheme,
        backgroundColor: colors.white
    },
    formItemTheme_input__dark: {
        ...applyThemeInputBackplateStyle(),
        background: darkTheme,
        backgroundColor: colors.black
    }
};

export default styles;
