import { ComponentStyles, ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ExplorerDesignSystem } from "./design-system";

export interface ExplorerClassNameContract {
    explorer?: string;
}

const style: ComponentStyles<ExplorerClassNameContract, ExplorerDesignSystem> = {
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
};

export default style;
