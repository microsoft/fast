import * as React from "react";

export interface AutoSuggestContextType {
    /**
     * The current value of the component
     * (ie. the string currently entered in the input box)
     */
    currentValue: string;
}

export const AutoSuggestContext: React.Context<
    AutoSuggestContextType
> = React.createContext({
    currentValue: "",
});
