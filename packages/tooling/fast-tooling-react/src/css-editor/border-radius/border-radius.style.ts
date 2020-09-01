import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlRegionStyle,
    controlWrapperStyle,
    inputStyle,
    labelStyle,
} from "../../style";

export interface CSSBorderRadiusClassNameContract {
    cssBorderRadius?: string;
    cssBorderRadius_control?: string;
    cssBorderRadius_input?: string;
    cssBorderRadius_individualInput?: string;
    cssBorderRadius_label?: string;
    cssBorderRadius_toggleButton?: string;
    cssBorderRadius_toggleButton__selected?: string;
    cssBorderRadius_toggleButtonGlyph?: string;
    cssBorderRadius_toggleButtonGlyphPath__highlight?: string;
}

const styles: ComponentStyles<CSSBorderRadiusClassNameContract, {}> = {
    cssBorderRadius: {
        ...controlWrapperStyle,
    },
    cssBorderRadius_control: {
        ...controlRegionStyle,
    },
    cssBorderRadius_input: {
        ...inputStyle,
        marginRight: "4px",
        width: "inherit",
    },
    cssBorderRadius_individualInput: {
        ...inputStyle,
        marginRight: "4px",
        width: "inherit",
    },
    cssBorderRadius_label: {
        ...labelStyle,
    },
    cssBorderRadius_toggleButton: {
        ...inputStyle,
        backgroundColor: "transparent",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        padding: "0 5px",
        minWidth: "12%",
    },
    cssBorderRadius_toggleButton__selected: {
        ...inputStyle,
    },
    cssBorderRadius_toggleButtonGlyph: {
        fill: "rgba(255,255,255, 0.5)",
        overflow: "unset",
        transition: "all 0.1s ease-in-out",
    },
    cssBorderRadius_toggleButtonGlyphPath__highlight: {
        fill: "rgba(255,255,255, 1)",
        transform: "scale(1.5)",
        transition: "all 0.1s ease-in-out",
    },
};

export default styles;
