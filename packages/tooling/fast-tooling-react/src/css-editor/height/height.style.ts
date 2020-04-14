import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlRegionStyle,
    controlWrapperStyle,
    inputStyle,
    labelStyle,
} from "../../style";

export interface CSSHeightClassNameContract {
    cssHeight?: string;
    cssHeight_control?: string;
    cssHeight_input?: string;
    cssHeight_label?: string;
}

const styles: ComponentStyles<CSSHeightClassNameContract, {}> = {
    cssHeight: {
        ...controlWrapperStyle,
    },
    cssHeight_control: {
        ...controlRegionStyle,
    },
    cssHeight_input: {
        ...inputStyle,
        width: "50%",
        marginLeft: "4px",
    },
    cssHeight_label: {
        ...labelStyle,
        width: "50%",
    },
};

export default styles;
