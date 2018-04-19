import * as CSS from "csstype";
import { JSSUtilities } from "./typedef";

export interface IEllipsis {
    whiteSpace: CSS.WhiteSpaceProperty;
    overflow: CSS.OverflowProperty;
    textOverflow: CSS.TextOverflowProperty;
}

export type Ellipsis = JSSUtilities<IEllipsis>;

export function ellipsis(): Ellipsis {
    return {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    };
}
