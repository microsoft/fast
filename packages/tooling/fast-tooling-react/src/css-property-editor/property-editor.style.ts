import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    codeHighlightCSSKeyColor,
    codeHighlightCSSValueColor,
    L4CSSProperty,
    textColorCSSProperty,
} from "../style";

export interface CSSPropertyEditorClassNameContract {
    cssPropertyEditor?: string;
    cssPropertyEditor_propertyRegion?: string;
    cssPropertyEditor_input?: string;
    cssPropertyEditor_inputKey?: string;
    cssPropertyEditor_inputValue?: string;
}

const styles: ComponentStyles<CSSPropertyEditorClassNameContract, {}> = {
    cssPropertyEditor: {
        background: L4CSSProperty,
        color: textColorCSSProperty,
        height: "100%",
        padding: "0",
        margin: "0",
        outlineWidth: "0",
        fontFamily: "Consolas, monaco, monospace, monospace",
        fontSize: "12px",
    },
    cssPropertyEditor_propertyRegion: {
        display: "inline-block",
        paddingLeft: "20px",
        width: "100%",
        outlineWidth: "0",
        "&::before, &::after": {
            marginLeft: "-20px",
        },
        "&::before": {
            content: "'{'",
        },
        "&::after": {
            display: "block",
            content: "'}'",
        },
    },
    cssPropertyEditor_row: {
        outlineWidth: "0",
    },
    cssPropertyEditor_input: {
        background: "transparent",
        fontFamily: "Consolas, monaco, monospace, monospace",
        border: "none",
        "&:focus": {
            boxShadow: `0 0 1px ${textColorCSSProperty}`,
            borderRadius: "2px",
            outline: "none",
        },
    },
    cssPropertyEditor_inputKey: {
        color: codeHighlightCSSKeyColor,
    },
    cssPropertyEditor_inputValue: {
        color: codeHighlightCSSValueColor,
        marginLeft: "5px",
    },
};

export default styles;
