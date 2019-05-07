import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { background300, cssKey, cssValue, foreground300 } from "../style";

export interface CSSPropertyEditorClassNameContract {
    cssPropertyEditor?: string;
    cssPropertyEditor_propertyRegion?: string;
    cssPropertyEditor_input?: string;
    cssPropertyEditor_inputKey?: string;
    cssPropertyEditor_inputValue?: string;
}

const styles: ComponentStyles<CSSPropertyEditorClassNameContract, {}> = {
    cssPropertyEditor: {
        background: background300,
        color: foreground300,
        height: "100%",
        padding: "0",
        margin: "0",
        fontFamily: "Consolas, monaco, monospace, monospace",
        fontSize: "12px",
    },
    cssPropertyEditor_propertyRegion: {
        display: "inline-block",
        paddingLeft: "20px",
        "&::before, &::after": {
            marginLeft: "-20px",
        },
        "&::before": {
            content: "'{'",
        },
        "&::after": {
            content: "'}'",
        },
    },
    cssPropertyEditor_input: {
        background: "transparent",
        fontFamily: "Consolas, monaco, monospace, monospace",
        border: "none",
        "&:focus": {
            boxShadow: `0 0 1px ${foreground300}`,
            borderRadius: "2px",
            outline: "none",
        },
    },
    cssPropertyEditor_inputKey: {
        color: cssKey,
    },
    cssPropertyEditor_inputValue: {
        color: cssValue,
        marginLeft: "5px",
    },
};

export default styles;
