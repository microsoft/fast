import * as CSS from "csstype";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { toPx } from "./units";

/**
 * @deprecated
 */
export interface MaxLines {
    overflow: CSS.OverflowProperty;
    boxSizing: CSS.Box;
    maxHeight: CSS.MaxHeightProperty<string>;
    whiteSpace?: CSS.WhiteSpaceProperty;
}

export function applyMaxLines(lines: number, lineHeight: number): CSSRules<any> {
    return {
        overflow: "hidden",
        "box-sizing": "content-box",
        "max-height": toPx(lines * lineHeight),
        "white-space": lines === 1 ? "nowrap" : null,
    };
}
