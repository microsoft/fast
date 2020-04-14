import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ContextMenu as BaseContextMenu } from "@microsoft/fast-components-react-base";
import React from "react";
import { neutralLayerFloating } from "@microsoft/fast-components-styles-msft";
import { DisplayNamePrefix } from "../utilities";
import { Background } from "../background";
import {
    ContextMenuHandledProps,
    ContextMenuProps,
    ContextMenuUnhandledProps,
} from "./context-menu.props";

class ContextMenu extends Foundation<
    ContextMenuHandledProps,
    ContextMenuUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}ContextMenu`;

    public static defaultProps: Partial<ContextMenuProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<ContextMenuHandledProps> = {
        children: void 0,
        managedClasses: void 0,
        enableAutoFocus: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <Background value={neutralLayerFloating} tag={null}>
                <BaseContextMenu
                    {...this.unhandledProps()}
                    enableAutoFocus={this.props.enableAutoFocus}
                    managedClasses={this.props.managedClasses}
                >
                    {this.props.children}
                </BaseContextMenu>
            </Background>
        );
    }
}

export default ContextMenu;
export * from "./context-menu.props";
