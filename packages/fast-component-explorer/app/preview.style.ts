import { ComponentStyles, ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, neutralLayerL1 } from "@microsoft/fast-components-styles-msft";
import { reduce } from "lodash-es";

export interface ExplorerClassNameContract {
    explorer?: string;
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
            height: "100vh",
            "& div": {
                height: "100%",
            },
        },
    },
    preview: {
        padding: "12px",
    },
};

export default style;
