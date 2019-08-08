import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    SelectOptionHandledProps,
    SelectOptionUnhandledProps,
} from "./select-option.props";
import { ListboxItem as BaseListboxItem } from "@microsoft/fast-components-react-base";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";
import { SelectOptionProps } from "./select-option.props";
import { SelectOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { classNames } from "@microsoft/fast-web-utilities";

class SelectOption extends Foundation<
    SelectOptionHandledProps,
    SelectOptionUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}SelectOption`;
    public static defaultProps: Partial<SelectOptionProps> = {
        managedClasses: {}
    }

    protected handledProps: HandledProps<SelectOptionHandledProps> = {
        glyph: void 0,
        value: void 0,
        id: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        const {
            selectOption,
            selectOption__disabled,
            selectOption__selected,
            selectOption_contentRegion
        }: SelectOptionClassNameContract = this.props.managedClasses;

        return (
            <BaseListboxItem
                {...this.unhandledProps()}
                id={this.props.id}
                displayString={this.props.displayString}
                value={this.props.value}
                managedClasses={{
                    listboxItem: selectOption,
                    listboxItem__disabled: selectOption__disabled,
                    listboxItem__selected: selectOption__selected,
                }}
            >
                {this.renderGlyph()}
                <span
                    className={classNames(
                        selectOption_contentRegion
                    )}
                >
                    {this.props.displayString}
                    {this.props.children}
                </span>
            </BaseListboxItem>
        );
    }

    private renderGlyph(): React.ReactNode {
        if (typeof this.props.glyph === "function") {
            return this.props.glyph(
                classNames((this.props.managedClasses as any).selectOption_glyph) // TODO: why doesn't this key exist?
            );
        }
        return null;
    }
}

export default SelectOption;
export * from "./select-option.props";
