import React from "react";
import {
    ListboxItemHandledProps as BaseListboxItemHandledProps,
    ListboxItemManagedClasses as BaseListboxItemManagedClasses,
    ListboxItemUnhandledProps as BaseListboxItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    AutoSuggestOptionClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export type AutoSuggestOptionManagedClasses = ManagedClasses<
    AutoSuggestOptionClassNameContract
>;
export interface AutoSuggestOptionHandledProps
    extends AutoSuggestOptionManagedClasses,
        Subtract<BaseListboxItemHandledProps, BaseListboxItemManagedClasses> {
    /**
     * The function that formats the display based on current search string
     */
    displayFormatter?: (displayString: string, searchString: string) => React.ReactNode;

    /**
     * Flag that enables/disables display formatting, default is true
     */
    formatDisplayString?: boolean;
}

export type AutoSuggestOptionUnhandledProps = BaseListboxItemUnhandledProps;
export type AutoSuggestOptionProps = AutoSuggestOptionHandledProps &
    AutoSuggestOptionUnhandledProps;
