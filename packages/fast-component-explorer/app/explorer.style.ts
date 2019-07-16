import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

export interface ExplorerClassNameContract {
    explorer?: string;
    explorer_controls?: string;
    explorer_viewerContrainer?: string;
    explorer_viewerControlContrainer?: string;
}

const style: ComponentStyles<ExplorerClassNameContract, DesignSystem> = {
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
        },
    },
    explorer: {},
    explorer_controls: {
        display: "flex",
        padding: "7px 10px",
        marginLeft: "auto",
        alignItems: "center",
    },
    explorer_viewerContrainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    explorer_viewerControlContrainer: {
        display: "flex",
    },
};

export default style;
