import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    SelectOptionHandledProps,
    SelectOptionUnhandledProps,
} from "./select-option.props";
import { ListboxItem as BaseListboxItem } from "@microsoft/fast-components-react-base";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";

class SelectOption extends Foundation<
    SelectOptionHandledProps,
    SelectOptionUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}SelectOption`;

    protected handledProps: HandledProps<SelectOptionHandledProps> = {
        glyph: void 0,
        value: void 0,
        id: void 0,
        managedClasses: void 0,
    };

    public render(): React.ReactNode {
        return (
            <BaseListboxItem
                {...this.unhandledProps()}
                id={this.props.id || null}
                displayString={this.props.displayString}
                value={this.props.value}
                managedClasses={{
                    listboxItem: get(this.props.managedClasses, "selectOption", ""),
                    listboxItem__disabled: get(
                        this.props.managedClasses,
                        "selectOption__disabled",
                        ""
                    ),
                    listboxItem__selected: get(
                        this.props.managedClasses,
                        "selectOption__selected",
                        ""
                    ),
                }}
            >
                {this.renderGlyph()}
                <span
                    className={get(
                        this.props.managedClasses,
                        "selectOption_contentRegion",
                        ""
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
                get(this.props, "managedClasses.selectOption_glyph", "")
            );
        }
        return null;
    }
}

export default SelectOption;
export * from "./select-option.props";
