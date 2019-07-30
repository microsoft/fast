import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControlRegion,
    applyControlWrapper,
    applyInputStyle,
    applyLabelStyle,
} from "../../style";

export interface CSSHeightClassNameContract {
    cssHeight?: string;
    cssHeight_control?: string;
    cssHeight_input?: string;
    cssHeight_label?: string;
}

const styles: ComponentStyles<CSSHeightClassNameContract, {}> = {
    cssHeight: {
        ...applyControlWrapper(),
    },
    cssHeight_control: {
        ...applyControlRegion(),
    },
    cssHeight_input: {
        ...applyInputStyle(),
        width: "50%",
        marginLeft: "4px",
    },
    cssHeight_label: {
        ...applyLabelStyle(),
        width: "50%",
    },
};

export default styles;
