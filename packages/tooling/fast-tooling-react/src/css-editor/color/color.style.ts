import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlRegionStyle,
    controlWrapperStyle,
    inputStyle,
    labelStyle,
} from "../../style";

export interface CSSColorClassNameContract {
    cssColor?: string;
    cssColor_colorInputRegion?: string;
    cssColor_control?: string;
    cssColor_input?: string;
    cssColor_label?: string;
}

const styles: ComponentStyles<CSSColorClassNameContract, {}> = {
    cssColor: {
        ...controlWrapperStyle,
    },
    cssColor_colorInputRegion: {
        borderRadius: "2px",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "18%",
    },
    cssColor_control: {
        ...controlRegionStyle,
    },
    cssColor_input: {
        ...inputStyle,
        marginLeft: "4px",
        width: "83%",
    },
    cssColor_label: {
        ...labelStyle,
    },
};

export default styles;
