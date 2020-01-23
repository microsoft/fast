import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlRegionStyle,
    controlWrapperStyle,
    inputStyle,
    labelStyle,
} from "../../style";

export interface CSSWidthClassNameContract {
    cssWidth?: string;
    cssWidth_control?: string;
    cssWidth_input?: string;
    cssWidth_label?: string;
}

const styles: ComponentStyles<CSSWidthClassNameContract, {}> = {
    cssWidth: {
        ...controlWrapperStyle,
    },
    cssWidth_control: {
        ...controlRegionStyle,
    },
    cssWidth_input: {
        ...inputStyle,
        width: "50%",
        marginLeft: "4px",
    },
    cssWidth_label: {
        ...labelStyle,
        width: "50%",
    },
};

export default styles;
