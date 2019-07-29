import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControlRegion,
    applyControlWrapper,
    applyInputStyle,
    applyLabelStyle,
    applySelectInputStyles,
    applySelectSpanStyles,
} from "../../style";

export interface CSSBorderClassNameContract {
    cssBorder?: string;
    cssBorder_colorInputRegion?: string;
    cssBorder_control?: string;
    cssBorder_input?: string;
    cssBorder_label?: string;
    cssBorder_selectControl?: string;
    cssBorder_select?: string;

}

const styles: ComponentStyles<CSSBorderClassNameContract, {}> = {
    cssBorder: {
        ...applyControlWrapper(),
    },
    cssBorder_colorInputRegion: {
        borderRadius: "2px",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "45px",
        marginRight: "8px",
    },
    cssBorder_control: {
        ...applyControlRegion(),
    },
    cssBorder_input: {
        ...applyInputStyle(),
    },
    cssBorder_label: {
        ...applyLabelStyle(),
    },
    cssBorder_selectControl: {
        ...applySelectSpanStyles(),
        marginRight: "8px",
    },
    cssBorder_select: {
        ...applySelectInputStyles(),
    },
};

export default styles;
