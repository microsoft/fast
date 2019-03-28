import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    ContextMenuItemHandledProps,
    ContextMenuItemManagedClasses,
    ContextMenuItemProps,
    ContextMenuItemUnhandledProps,
} from "./context-menu-item.props";
import { ContextMenuItem as BaseContextMenuItem } from "@microsoft/fast-components-react-base";
import { get } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";

class ContextMenuItem extends Foundation<
    ContextMenuItemHandledProps,
    ContextMenuItemUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}ContextMenuItem`;

    protected handledProps: HandledProps<ContextMenuItemHandledProps> = {
        before: void 0,
    };

    public render(): React.ReactNode {
        return (
            <BaseContextMenuItem {...this.unhandledProps()}>
                {this.props.before !== undefined ? this.props.before : undefined}
                <span
                    className={get(
                        this.props.managedClasses,
                        "contextMenuItem_contentRegion"
                    )}
                >
                    {this.props.children}
                </span>
            </BaseContextMenuItem>
        );
    }
}

export default ContextMenuItem;
export * from "./context-menu-item.props";
