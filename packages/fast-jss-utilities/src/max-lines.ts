import * as CSS from "csstype";
import { toPx } from "./units";
import { CSSRules } from "@microsoft/fast-jss-manager";

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
        boxSizing: "content-box",
        maxHeight: toPx(lines * lineHeight),
        whiteSpace: lines === 1 ? "nowrap" : null,
    };
}
