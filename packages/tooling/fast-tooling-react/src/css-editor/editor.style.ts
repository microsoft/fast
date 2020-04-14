import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { CSSPositionClassNameContract } from "./position/position.style";
import { foreground300, neutralLayerL4 } from "../style";

export interface CSSEditorClassNameContract extends CSSPositionClassNameContract {
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
