import * as CSS from "csstype";
import { CSSRules } from "@microsoft/fast-jss-manager";

/**
 * @deprecated
 */
export interface Ellipsis {
    whiteSpace: CSS.WhiteSpaceProperty;
    overflow: CSS.OverflowProperty;
    textOverflow: CSS.TextOverflowProperty;
}

export function ellipsis(): CSSRules<any> {
    return {
        "white-space": "nowrap",
        overflow: "hidden",
        "text-overflow": "ellipsis",
    };
}
