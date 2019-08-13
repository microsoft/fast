import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControlRegion,
    applyControlWrapper,
    applyInputBackplateStyle,
    applyInputStyle,
    applyLabelStyle,
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
        ...applyControlWrapper(),
    },
    cssBorderRadius_control: {
        ...applyControlRegion(),
    },
    cssBorderRadius_input: {
        ...applyInputStyle(),
        marginRight: "4px",
        width: "inherit",
    },
    cssBorderRadius_individualInput: {
        ...applyInputStyle(),
        marginRight: "4px",
        width: "inherit",
    },
    cssBorderRadius_label: {
        ...applyLabelStyle(),
    },
    cssBorderRadius_toggleButton: {
        ...applyInputStyle(),
        backgroundColor: "transparent",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        padding: "0 5px",
        minWidth: "12%",
    },
    cssBorderRadius_toggleButton__selected: {
        ...applyInputStyle(),
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
