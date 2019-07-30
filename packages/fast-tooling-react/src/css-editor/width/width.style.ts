import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControlRegion,
    applyControlWrapper,
    applyInputStyle,
    applyLabelStyle,
} from "../../style";

export interface CSSWidthClassNameContract {
    cssWidth?: string;
    cssWidth_control?: string;
    cssWidth_input?: string;
    cssWidth_label?: string;
}

const styles: ComponentStyles<CSSWidthClassNameContract, {}> = {
    cssWidth: {
        ...applyControlWrapper(),
    },
    cssWidth_control: {
        ...applyControlRegion(),
    },
    cssWidth_input: {
        ...applyInputStyle(),
        width: "50%",
        marginLeft: "4px",
    },
    cssWidth_label: {
        ...applyLabelStyle(),
        width: "50%",
    },
};

export default styles;
