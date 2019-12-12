import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyControlWrapper, applyInputStyle } from "../../style";

export interface CSSHeightClassNameContract {
    cssHeight?: string;
    cssHeight__disabled?: string;
    cssHeight_input?: string;
}

const styles: ComponentStyles<CSSHeightClassNameContract, {}> = {
    cssHeight: {
        ...applyControlWrapper(),
    },
    cssWidth__disabled: {},
    cssHeight_input: {
        ...applyInputStyle(),
        width: "50%",
        marginLeft: "4px",
    },
};

export default styles;
