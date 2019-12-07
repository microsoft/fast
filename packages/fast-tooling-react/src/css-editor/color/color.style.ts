import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyControlRegion, applyControlWrapper, applyInputStyle } from "../../style";

export interface CSSColorClassNameContract {
    cssColor?: string;
    cssColor_colorInputRegion?: string;
    cssColor_control?: string;
    cssColor_input?: string;
}

const styles: ComponentStyles<CSSColorClassNameContract, {}> = {
    cssColor: {
        ...applyControlWrapper(),
    },
    cssColor_colorInputRegion: {
        borderRadius: "2px",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "18%",
    },
    cssColor_control: {
        ...applyControlRegion(),
    },
    cssColor_input: {
        ...applyInputStyle(),
        marginLeft: "4px",
        width: "83%",
    },
};

export default styles;
