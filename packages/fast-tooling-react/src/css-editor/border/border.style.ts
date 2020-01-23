import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlRegionStyle,
    controlWrapperStyle,
    inputStyle,
    labelStyle,
    selectInputStyle,
    selectSpanStyle,
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
        ...controlWrapperStyle,
    },
    cssBorder_colorInputRegion: {
        borderRadius: "2px",
        position: "relative",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "18%",
    },
    cssBorder_control: {
        ...controlRegionStyle,
    },
    cssBorder_input: {
        ...inputStyle,
        width: "22%",
        marginLeft: "4px",
    },
    cssBorder_label: {
        ...labelStyle,
    },
    cssBorder_selectControl: {
        ...selectSpanStyle,
        marginLeft: "4px",
        width: "60%",
    },
    cssBorder_select: {
        ...selectInputStyle,
        padding: "3px 15px 2px 5px",
    },
};

export default styles;
