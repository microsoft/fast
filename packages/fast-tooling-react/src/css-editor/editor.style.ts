import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { CSSPositionClassNameContract } from "./position/position.style";
import { background300, foreground300 } from "../style";

export interface CSSEditorClassNameContract extends CSSPositionClassNameContract {
    cssEditor?: string;
}

const styles: ComponentStyles<CSSEditorClassNameContract, {}> = {
    cssEditor: {
        background: background300,
        color: foreground300,
        height: "100%",
        padding: "0 0 0 10px",
    },
};

export default styles;
