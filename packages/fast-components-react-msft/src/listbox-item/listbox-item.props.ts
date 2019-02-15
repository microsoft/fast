import * as React from "react";
import { Subtract } from "utility-types";
import {
    ListboxItemHandledProps as BaseListboxItemHandledProps,
    ListboxItemManagedClasses as BaseListboxItemManagedClasses,
    ListboxItemUnhandledProps as BaseListboxItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ListboxItemClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface ListboxItemManagedClasses
    extends ManagedClasses<ListboxItemClassNameContract> {}
export interface ListboxItemHandledProps
    extends ListboxItemManagedClasses,
        Subtract<BaseListboxItemHandledProps, BaseListboxItemManagedClasses> {
    /**
     * The listbox item glyph render prop
     */
    glyph?: (className: string) => React.ReactNode;
}

/* tslint:disable-next-line:no-empty-interface */
export interface ListboxItemUnhandledProps extends BaseListboxItemUnhandledProps {}
export type ListboxItemProps = ListboxItemHandledProps & ListboxItemUnhandledProps;
