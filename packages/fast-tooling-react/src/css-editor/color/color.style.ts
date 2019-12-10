import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { applyControlRegion, applyControlWrapper, applyInputStyle } from "../../style";

export interface CSSColorClassNameContract {
    cssColor?: string;
    cssColor__disabled?: string;
    cssColor_colorInputRegion?: string;
    cssColor_input?: string;
}

const styles: ComponentStyles<CSSColorClassNameContract, {}> = {
    cssColor: {
        ...applyControlWrapper(),
        ...applyControlRegion(),
    },
    cssColor__disabled: {},
    cssColor_colorInputRegion: {
        borderRadius: "2px",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "18%",
    },
    cssColor_input: {
        ...applyInputStyle(),
        marginLeft: "4px",
        width: "83%",
    },
};

export default styles;
