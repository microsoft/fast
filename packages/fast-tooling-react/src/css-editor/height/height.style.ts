import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyControlWrapper, applyInputStyle } from "../../style";

export interface CSSHeightClassNameContract {
    cssHeight?: string;
    cssHeight_disabled?: string;
    cssHeight_input?: string;
}

const styles: ComponentStyles<CSSHeightClassNameContract, {}> = {
    cssHeight: {
        ...applyControlWrapper(),
    },
    cssWidth_disabled: {},
    cssHeight_input: {
        ...applyInputStyle(),
        width: "50%",
        marginLeft: "4px",
    },
};

export default styles;
