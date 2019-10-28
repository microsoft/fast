import React from "react";

export interface ViewportContextType {
    viewport: React.RefObject<any> | HTMLElement;
}

export const ViewportContext: React.Context<ViewportContextType> = React.createContext({
    viewport: null,
});
