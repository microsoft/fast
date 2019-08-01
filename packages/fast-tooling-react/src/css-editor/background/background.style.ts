import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControlRegion,
    applyControlWrapper,
    applyInputStyle,
    applyLabelStyle,
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
        ...applyControlWrapper(),
    },
    cssBackground_colorInputRegion: {
        borderRadius: "2px",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "18%",
    },
    cssBackground_control: {
        ...applyControlRegion(),
    },
    cssBackground_input: {
        ...applyInputStyle(),
        marginLeft: "4px",
        width: "83%",
    },
    cssBackground_label: {
        ...applyLabelStyle(),
    },
};

export default styles;
