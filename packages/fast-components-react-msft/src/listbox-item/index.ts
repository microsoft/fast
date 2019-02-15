import * as React from "react";
import MSFTListboxItem, {
    ListboxItemHandledProps as MSFTListboxItemHandledProps,
    ListboxItemManagedClasses,
    ListboxItemProps as MSFTListboxItemProps,
    ListboxItemUnhandledProps,
} from "./listbox-item";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ListboxItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem, ListboxItemStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const ListboxItem = manageJss(ListboxItemStyles)(MSFTListboxItem);
type ListboxItem = InstanceType<typeof ListboxItem>;

interface ListboxItemHandledProps
    extends Subtract<MSFTListboxItemHandledProps, ListboxItemManagedClasses> {}
type ListboxItemProps = ManagedJSSProps<
    MSFTListboxItemProps,
    ListboxItemClassNameContract,
    DesignSystem
>;

export {
    ListboxItem,
    ListboxItemProps,
    ListboxItemClassNameContract,
    ListboxItemHandledProps,
    ListboxItemUnhandledProps,
};
