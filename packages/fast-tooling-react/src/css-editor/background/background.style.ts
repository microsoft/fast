import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    controlRegionStyle,
    controlWrapperStyle,
    inputStyle,
    labelStyle,
} from "../../style";

export interface CSSBackgroundClassNameContract {
    cssBackground?: string;
    cssBackground_colorInputRegion?: string;
    cssBackground_control?: string;
    cssBackground_input?: string;
    cssBackground_label?: string;
}

const styles: ComponentStyles<CSSBackgroundClassNameContract, {}> = {
    cssBackground: {
        ...controlWrapperStyle,
    },
    cssBackground_colorInputRegion: {
        borderRadius: "2px",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "18%",
    },
    cssBackground_control: {
        ...controlRegionStyle,
    },
    cssBackground_input: {
        ...inputStyle,
        marginLeft: "4px",
        width: "83%",
    },
    cssBackground_label: {
        ...labelStyle,
    },
};

export default styles;
