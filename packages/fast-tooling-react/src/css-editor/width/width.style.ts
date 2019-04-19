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
    },
    cssWidth_label: {
        ...applyLabelStyle(),
    },
};

export default styles;
