import React from "react";
import { Subtract } from "utility-types";
import {
    ListboxItemHandledProps as BaseListboxItemHandledProps,
    ListboxItemManagedClasses as BaseListboxItemManagedClasses,
    ListboxItemUnhandledProps as BaseListboxItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    SelectOptionClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface SelectOptionManagedClasses
    extends ManagedClasses<SelectOptionClassNameContract> {}
export interface SelectOptionHandledProps
    extends SelectOptionManagedClasses,
        Subtract<BaseListboxItemHandledProps, BaseListboxItemManagedClasses> {
    /**
     * The select option item glyph render prop
     */
    glyph?: (className: string) => React.ReactNode;
}

/* tslint:disable-next-line:no-empty-interface */
export interface SelectOptionUnhandledProps extends BaseListboxItemUnhandledProps {}
export type SelectOptionProps = SelectOptionHandledProps & SelectOptionUnhandledProps;
