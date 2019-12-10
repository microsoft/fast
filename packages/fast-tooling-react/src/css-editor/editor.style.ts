import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { foreground300, neutralLayerL4 } from "../style";

export interface CSSEditorClassNameContract {
    cssEditor?: string;
}

const styles: ComponentStyles<CSSEditorClassNameContract, {}> = {
    cssEditor: {
        background: neutralLayerL4,
        color: foreground300,
        height: "100%",
        padding: "0 10px",
    },
};

export default styles;
