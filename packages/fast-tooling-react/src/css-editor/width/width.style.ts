import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyControlWrapper, applyInputStyle } from "../../style";

export interface CSSWidthClassNameContract {
    cssWidth?: string;
    cssWidth_input?: string;
    cssWidth__disabled?: string;
}

const styles: ComponentStyles<CSSWidthClassNameContract, {}> = {
    cssWidth: {
        ...applyControlWrapper(),
    },
    cssWidth__disabled: {},
    cssWidth_input: {
        ...applyInputStyle(),
        width: "50%",
        marginLeft: "4px",
    },
};

export default styles;
