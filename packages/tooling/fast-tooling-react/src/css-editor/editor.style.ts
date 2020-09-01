import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { L4CSSProperty, textColorCSSProperty } from "../style";
import { CSSPositionClassNameContract } from "./position/position.style";

export interface CSSEditorClassNameContract extends CSSPositionClassNameContract {
    cssEditor?: string;
}

const styles: ComponentStyles<CSSEditorClassNameContract, {}> = {
    cssEditor: {
        background: L4CSSProperty,
        color: textColorCSSProperty,
        height: "100%",
        padding: "0 10px",
    },
};

export default styles;
