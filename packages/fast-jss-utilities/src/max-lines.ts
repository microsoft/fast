import * as CSS from "csstype";
import { JSSUtilities } from "./typedef";
import { toPx } from "./units";

export interface IMaxLines {
    overflow: CSS.OverflowProperty;
    boxSizing: CSS.Box;
    maxHeight: CSS.MaxHeightProperty<string>;
    whiteSpace?: CSS.WhiteSpaceProperty;
}

export type MaxLines = JSSUtilities<IMaxLines>;

export function applyMaxLines(lines: number, lineHeight: number): MaxLines {
    let whitespace: CSS.WhiteSpaceProperty = null;

    if (lines === 1) {
        whitespace = "nowrap";
    }

    return {
        overflow: "hidden",
        boxSizing: "content-box",
        maxHeight: toPx(lines * lineHeight),
        whiteSpace: whitespace
    };
}
