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
        position: "relative",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "18%",
    },
    cssBorder_control: {
        ...applyControlRegion(),
    },
    cssBorder_input: {
        ...applyInputStyle(),
        width: "22%",
        marginLeft: "4px",
    },
    cssBorder_label: {
        ...applyLabelStyle(),
    },
    cssBorder_selectControl: {
        ...applySelectSpanStyles(),
        marginLeft: "4px",
        width: "60%",
    },
    cssBorder_select: {
        ...applySelectInputStyles(),
        padding: "3px 15px 2px 5px",
    },
};

export default styles;
