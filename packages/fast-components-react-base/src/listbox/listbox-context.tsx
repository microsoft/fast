import * as React from "react";

export interface ListboxItemData {
    id: string;
    value: string;
    displayString: string;
}

export interface ListboxContextType {
    listboxItemInvoked: (
        itemInvoked: ListboxItemData,
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) => void;
    listboxItemFocused: (
        itemFocused: ListboxItemData,
        event: React.FocusEvent<HTMLDivElement>
    ) => void;
    listboxSelectedItems: ListboxItemData[];
    listboxMultiselectable: boolean;
}

export const ListboxContext: React.Context<ListboxContextType> = React.createContext({
    listboxItemInvoked: null,
    listboxItemFocused: null,
    listboxSelectedItems: [],
    listboxMultiselectable: false,
});
