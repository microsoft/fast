import * as React from "react";

export interface ListboxItemData {
    id: string;
    value: string;
    displayString: string;
}

export interface ListboxContextType {
    itemInvoked: (
        itemInvoked: ListboxItemData,
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) => void;
    itemFocused: (
        itemFocused: ListboxItemData,
        event: React.FocusEvent<HTMLDivElement>
    ) => void;
    selectedItems: ListboxItemData[];
    multiselectable: boolean;
}

export const ListboxContext: React.Context<ListboxContextType> = React.createContext({
    itemInvoked: null,
    itemFocused: null,
    selectedItems: [],
    multiselectable: false,
});
