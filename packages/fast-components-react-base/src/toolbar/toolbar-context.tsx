import React from "react";
import { Orientation } from "@microsoft/fast-web-utilities";

export interface ToolbarContextType {
    // the itempath associated with the toolbar's currently focused item
    currentFocusItemPath: string;

    // the orientaion for the toolbar
    orientation: Orientation;
}

export const ToolbarContext: React.Context<ToolbarContextType> = React.createContext({
    currentFocusItemPath: "-1",
    orientation: Orientation.horizontal,
});
