import { ComponentStyles } from "@microsoft/fast-jss-manager";
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
    },
    cssHeight_label: {
        ...applyLabelStyle(),
    },
};

export default styles;
