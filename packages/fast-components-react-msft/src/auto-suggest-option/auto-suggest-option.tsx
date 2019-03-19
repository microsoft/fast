import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    AutoSuggestOptionHandledProps,
    AutoSuggestOptionProps,
    AutoSuggestOptionUnhandledProps,
} from "./auto-suggest-option.props";
import {
    AutoSuggestContext,
    AutoSuggestContextType,
    ListboxItem as BaseListboxItem,
} from "@microsoft/fast-components-react-base";
import { get, slice } from "lodash-es";
import { startsWith } from "@microsoft/fast-web-utilities";
import { isNullOrUndefined } from "util";

class AutoSuggestOption extends Foundation<
    AutoSuggestOptionHandledProps,
    AutoSuggestOptionUnhandledProps,
    {}
> {
    public static displayName: string = "AutoSuggestOption";

    public static contextType: React.Context<AutoSuggestContextType> = AutoSuggestContext;

    public static defaultProps: Partial<AutoSuggestOptionProps> = {
        formatDisplayString: true,
    };

    protected handledProps: HandledProps<AutoSuggestOptionHandledProps> = {
        value: void 0,
        id: void 0,
        displayFormatter: void 0,
        formatDisplayString: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <BaseListboxItem
                {...this.unhandledProps()}
                id={this.props.id}
                value={this.props.value}
                managedClasses={{
                    listboxItem: get(this.props.managedClasses, "autoSuggestOption", ""),
                    listboxItem__disabled: get(
                        this.props.managedClasses,
                        "autoSuggestOption__disabled",
                        ""
                    ),
                    listboxItem__selected: get(
                        this.props.managedClasses,
                        "autoSuggestOption__selected",
                        ""
                    ),
                }}
            >
                <span
                    className={get(
                        this.props.managedClasses,
                        "autoSuggestOption_contentRegion",
                        ""
                    )}
                >
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
            !isNullOrUndefined(displayString) &&
            !isNullOrUndefined(searchString) &&
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
