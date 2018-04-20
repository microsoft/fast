import * as CSS from "csstype";

export interface IEllipsis {
    whiteSpace: CSS.WhiteSpaceProperty;
    overflow: CSS.OverflowProperty;
    textOverflow: CSS.TextOverflowProperty;
}

export function ellipsis(): IEllipsis {
    return {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    };
}
