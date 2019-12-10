import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyControlRegion, applyControlWrapper, applyInputStyle } from "../../style";

export interface CSSWidthClassNameContract {
    cssWidth?: string;
    cssWidth_input?: string;
    cssWidth_disabled?: string;
}

const styles: ComponentStyles<CSSWidthClassNameContract, {}> = {
    cssWidth: {
        ...applyControlWrapper(),
    },
    cssWidth_disabled: {},
    cssWidth_input: {
        ...applyInputStyle(),
        width: "50%",
        marginLeft: "4px",
    },
};

export default styles;
