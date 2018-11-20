import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { CSSPositionClassNameContract } from "./position/position.style";

export interface CSSEditorClassNameContract extends CSSPositionClassNameContract {
    cssEditor?: string;
}

const styles: ComponentStyles<CSSEditorClassNameContract, {}> = {
    cssEditor: {},
};

export default styles;
