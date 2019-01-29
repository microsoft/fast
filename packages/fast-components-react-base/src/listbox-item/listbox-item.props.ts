import * as React from "react";
import {
    ListboxItemClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface ListboxItemManagedClasses
    extends ManagedClasses<ListboxItemClassNameContract> {}
export interface ListboxItemUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ListboxItemHandledProps extends ListboxItemManagedClasses {
    /**
     * The children of the listbox item
     */
    children?: React.ReactNode;

    /**
     * If the item is disabled
     */
    disabled?: boolean;

    /**
     * the value of the item
     */
    value: string;

    /**
     * The unique id for the item
     */
    id: string;

    /**
     * Friendly string that may be used in ui display
     */
    displayString?: string;

    /**
     * Callback for when an item is invoked
     * Returns the prop contract for the invoked listbox item
     */
    onInvoke?: (
        e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
        props: ListboxItemProps
    ) => void;
}

export type ListboxItemProps = ListboxItemHandledProps & ListboxItemUnhandledProps;
