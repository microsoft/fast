import * as React from "react";
import {
    Listbox as BaseListbox,
    ListboxClassNameContract,
    ListboxHandledProps as BaseListboxHandledProps,
    ListboxManagedClasses,
    ListboxProps as BaseListboxProps,
    ListboxUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, ListboxStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const Listbox = manageJss(ListboxStyles)(BaseListbox);
type Listbox = InstanceType<typeof Listbox>;

interface ListboxHandledProps
    extends Subtract<BaseListboxHandledProps, ListboxManagedClasses> {}
type ListboxProps = ManagedJSSProps<
    BaseListboxProps,
    ListboxClassNameContract,
    DesignSystem
>;

export {
    Listbox,
    ListboxManagedClasses,
    ListboxProps,
    ListboxClassNameContract,
    ListboxHandledProps,
    ListboxUnhandledProps,
};
