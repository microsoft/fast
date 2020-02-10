import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FooterClassNameContract } from "./footer.props";
import { DesignSystem } from "../design-system/index";
import {
    applyFontWeightSemiBold,
    applyScaledTypeRamp,
    neutralForegroundHint
} from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<FooterClassNameContract, DesignSystem> = {
    "@global": {
        body: {
            fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            margin: "0",
            padding: "0"
        }
    },
    footer: {
        listStyleType: "none",
        backgroundColor: (config: DesignSystem): string => config.backgroundColor,
        height: "100%",
        margin: "0 auto",
        overflow: "hidden",
        "& span, & a": {
            ...applyScaledTypeRamp("t8"),
            color: neutralForegroundHint,
            textDecoration: "none",
            display: "inline-block"
        }
    },
    footer_wrapper: {
        margin: "30px auto 0",
        maxWidth: "calc(1600px + 10%)",
        padding: "0 5%",
        boxSizing: "border-box"
    },
    currentTitle: {
        ...applyScaledTypeRamp("t5"),
        ...applyFontWeightSemiBold()
    },
    social: {
        margin: "0px",
        order: "2",
        padding: "16px 0",
        fontSize: "15px",
        display: "flex",
        "& img": {
            maxWidth: "24px",
            padding: "0 24px 4px 0"
        },
        "& a": {
            padding: "0 24px 4px 0",
            display: "inline-block"
        },
        "@media only screen and (max-width: 768px)": {
            display: "block",
            float: "unset"
        }
    },
    ul: {
        order: "1",
        listStyleType: "none",
        margin: "0px",
        padding: "16px 0",
        fontSize: "15px",
        display: "flex",
        "& a": {
            padding: "0 24px 4px 0",
            display: "inline-block"
        },
        "@media only screen and (max-width: 768px)": {
            display: "block",
            float: "left"
        }
    },
    container: {
        width: "100%"
    },
    column: {
        width: "100%",
        minHeight: "60px",
        flexWrap: "wrap",
        margin: "10px 0px 0px",
        display: "flex",
        justifyContent: "space-between"
    }
};

export default styles;
