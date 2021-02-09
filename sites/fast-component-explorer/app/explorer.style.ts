import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { neutralLayerL1, neutralLayerL3 } from "@microsoft/fast-components-styles-msft";

export const accent: string = "#FB356D";

export const scrollbarStyle: CSSRules<{}> = {
    "&::-webkit-scrollbar": {
        background: neutralLayerL1,
        width: "8px",
        height: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
        background: neutralLayerL3,
        borderRadius: "8px",
    },
};
