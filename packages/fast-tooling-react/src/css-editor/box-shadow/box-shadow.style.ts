import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
    applyControlRegion,
    applyControlWrapper,
    applyInputStyle,
    applyLabelStyle,
} from "../../style";

export interface CSSBoxShadowClassNameContract {
    cssBoxShadow?: string;
    cssBoxShadow_colorInputRegion?: string;
    cssBoxShadow_control?: string;
    cssBoxShadow_controlRegion?: string;
    cssBoxShadow_opacityInput?: string;
    cssBoxShadow_xInput?: string;
    cssBoxShadow_yInput?: string;
    cssBoxShadow_blurInput?: string;
    cssBoxShadow_label?: string;
    cssBoxShadow__disabled?: string;
}

const styles: ComponentStyles<CSSBoxShadowClassNameContract, {}> = {
    cssBoxShadow: {
        ...applyControlWrapper(),
        ...applyControlRegion(),
    },
    cssBoxShadow_colorInputRegion: {
        borderRadius: "2px",
        boxShadow: "0 0 0 1px inset rgba(255, 255, 255, 0.19)",
        width: "49%",
        height: "29px",
        position: "relative",
        "&::after": {
            fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            content: "'%'",
            fontSize: "12px",
            position: "absolute",
            right: "-38px",
            top: "6px",
            pointerEvents: "none",
        },
    },
    cssBoxShadow_control: {
        ...applyControlRegion(),
        display: "flex",
        alignItems: "flex-end",
        width: "37%",
    },
    cssBoxShadow_controlRegion: {
        display: "flex",
        flexDirection: "column",
        width: "21%",
        marginLeft: "4px",
    },
    cssBoxShadow_opacityInput: {
        ...applyInputStyle(),
        width: "51%",
        height: "27px",
        marginLeft: "4px",
    },
    cssBoxShadow_xInput: {
        ...applyInputStyle(),
        height: "27px",
    },
    cssBoxShadow_yInput: {
        ...applyInputStyle(),
        height: "27px",
    },
    cssBoxShadow_blurInput: {
        ...applyInputStyle(),
        height: "27px",
    },
    cssBoxShadow_label: {
        ...applyLabelStyle(),
    },
    cssBoxShadow__disabled: {},
};

export default styles;
