import * as React from "react";

export interface AutoSuggestContextType {
    currentValue: string;
}

export const AutoSuggestContext: React.Context<
    AutoSuggestContextType
> = React.createContext({
    currentValue: "",
});
