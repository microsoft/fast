import { toPx } from "@microsoft/fast-jss-utilities";
import {
    applyControl,
    applyInputContainerStyle,
    applyInputStyle,
    applyLabelStyle,
    applySoftRemove,
    applySoftRemoveInput,
    applyWrapperStyle,
    colors,
    darkTheme,
    lightTheme,
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
            borderColor: colors.pink,
        },
        "&:hover": {
            borderColor: colors.black,
        },
    };
}

const styles: ComponentStyles<FormItemThemeClassNameContract, {}> = {
    formItemTheme: {
        display: "block",
        position: "relative",
    },
    formItemTheme_control: {
        ...applyControl(),
    },
    formItemTheme_controlLabel: {
        ...applyLabelStyle(),
    },
    formItemTheme_controlInputContainer: {
        ...applyInputContainerStyle(),
    },
    formItemTheme_controlInput__light: {
        ...applyThemeInputBackplateStyle(),
        background: lightTheme,
        backgroundColor: colors.white,
    },
    formItemTheme_controlInput__dark: {
        ...applyThemeInputBackplateStyle(),
        background: darkTheme,
        backgroundColor: colors.black,
    },
    formItemTheme_softRemove: {
        ...applySoftRemove(),
    },
    formItemTheme_softRemoveInput: {
        ...applySoftRemoveInput(),
    },
};

export default styles;
