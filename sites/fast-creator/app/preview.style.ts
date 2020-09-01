import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

export interface PreviewClassNameContract {
    preview?: string;
}

const style: ComponentStyles<PreviewClassNameContract, DesignSystem> = {
    "@font-face": {
        fontFamily: "Segoe UI",
        src:
            "url('//c.s-microsoft.com/static/fonts/segoe-ui/west-european/Normal/latest.woff2') format('woff2')",
    },
    "@global": {
        "body, html": {
            fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            fontSize: "12px",
            padding: "0",
            margin: "0",
            height: "100vh",
            "& #root": {
                height: "100%",
            },
            "& #root > div": {
                height: "100%",
            },
        },
    },
    preview: {
        height: "100%",
        boxSizing: "border-box",
    },
};

export default style;
