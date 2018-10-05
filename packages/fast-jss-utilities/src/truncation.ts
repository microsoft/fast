import * as CSS from "csstype";

export interface Ellipsis {
    whiteSpace: CSS.WhiteSpaceProperty;
    overflow: CSS.OverflowProperty;
    textOverflow: CSS.TextOverflowProperty;
}

export function ellipsis(): Ellipsis {
    return {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    };
}
