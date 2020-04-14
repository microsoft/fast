import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    AutoSuggestContext,
    AutoSuggestContextType,
    ListboxItem as BaseListboxItem,
} from "@microsoft/fast-components-react-base";
import { classNames, startsWith } from "@microsoft/fast-web-utilities";
import { isNil } from "lodash-es";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    AutoSuggestOptionHandledProps,
    AutoSuggestOptionProps,
    AutoSuggestOptionUnhandledProps,
} from "./auto-suggest-option.props";
import { AutoSuggestOptionClassNameContract } from ".";

class AutoSuggestOption extends Foundation<
    AutoSuggestOptionHandledProps,
    AutoSuggestOptionUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}AutoSuggestOption`;

    public static contextType: React.Context<AutoSuggestContextType> = AutoSuggestContext;

    public static defaultProps: Partial<AutoSuggestOptionProps> = {
        formatDisplayString: true,
        managedClasses: {},
    };

    protected handledProps: HandledProps<AutoSuggestOptionHandledProps> = {
        value: void 0,
        id: void 0,
        displayFormatter: void 0,
        formatDisplayString: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        const {
            autoSuggestOption,
            autoSuggestOption__selected,
            autoSuggestOption__disabled,
            autoSuggestOption_contentRegion,
        }: AutoSuggestOptionClassNameContract = this.props.managedClasses;

        return (
            <BaseListboxItem
                {...this.unhandledProps()}
                id={this.props.id}
                value={this.props.value}
                managedClasses={{
                    listboxItem: classNames(autoSuggestOption),
                    listboxItem__disabled: classNames(autoSuggestOption__disabled),
                    listboxItem__selected: classNames(autoSuggestOption__selected),
                }}
            >
                <span className={classNames(autoSuggestOption_contentRegion)}>
                    {this.formatDisplayString()}
                    {this.props.children}
                </span>
            </BaseListboxItem>
        );
    }

    /**
     * Calls the right function to format the display string
     */
    private formatDisplayString = (): React.ReactNode => {
        const displayString: string =
            this.props.displayString !== undefined
                ? this.props.displayString
                : this.props.value;
        if (!this.props.formatDisplayString) {
            return displayString;
        }
        return typeof this.props.displayFormatter === "function"
            ? this.props.displayFormatter(
                  displayString,
                  (this.context as AutoSuggestContextType).currentValue
              )
            : this.defaultDisplayFormatter(
                  displayString,
                  (this.context as AutoSuggestContextType).currentValue
              );
    };

    /**
     * Default display string formatter function
     */
    private defaultDisplayFormatter = (
        displayString: string,
        searchString: string
    ): React.ReactNode => {
        if (
            !isNil(displayString) &&
            !isNil(searchString) &&
            startsWith(displayString.toLowerCase(), searchString.toLowerCase())
        ) {
            return (
                <span>
                    <b>{displayString.substring(0, searchString.length)}</b>
                    {displayString.substring(searchString.length, displayString.length)}
                </span>
            );
        }
        return displayString;
    };
}

AutoSuggestOption.contextType = AutoSuggestContext;
export default AutoSuggestOption;
export * from "./auto-suggest-option.props";
