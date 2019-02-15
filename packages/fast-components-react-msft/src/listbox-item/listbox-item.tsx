import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ListboxItemHandledProps, ListboxItemUnhandledProps } from "./listbox-item.props";
import { ListboxItem as BaseListboxItem } from "@microsoft/fast-components-react-base";
import { get } from "lodash-es";

class ListboxItem extends Foundation<
    ListboxItemHandledProps,
    ListboxItemUnhandledProps,
    {}
> {
    public static displayName: string = "ListboxItem";

    protected handledProps: HandledProps<ListboxItemHandledProps> = {
        glyph: void 0,
        value: void 0,
        id: void 0,
    };

    public render(): React.ReactNode {
        return (
            <BaseListboxItem
                {...this.unhandledProps()}
                id={this.props.id}
                displayString={this.props.displayString}
                value={this.props.value}
            >
                {this.renderGlyph()}
                <span
                    className={get(
                        this.props.managedClasses,
                        "listboxItem_contentRegion"
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
                get(this.props, "managedClasses.listboxItem_glyph", "")
            );
        }
        return null;
    }
}

export default ListboxItem;
export * from "./listbox-item.props";
