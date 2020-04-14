import React from "react";
import { ListboxItemProps } from "../listbox-item";

export interface ListboxContextType {
    listboxItemInvoked: (
        itemInvoked: ListboxItemProps,
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) => void;
    listboxItemFocused: (
        itemFocused: ListboxItemProps,
        event: React.FocusEvent<HTMLDivElement>
    ) => void;
    listboxSelectedItems: ListboxItemProps[];
    listboxMultiselectable: boolean;
}

export const ListboxContext: React.Context<ListboxContextType> = React.createContext({
    listboxItemInvoked: null,
    listboxItemFocused: null,
    listboxSelectedItems: [],
    listboxMultiselectable: false,
});
