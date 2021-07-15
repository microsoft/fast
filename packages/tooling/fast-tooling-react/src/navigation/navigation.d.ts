import React from "react";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    NavigationHandledProps,
    NavigationProps,
    NavigationState,
} from "./navigation.props";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { NavigationClassNameContract } from "./navigation.style";
export declare const navigationId = "fast-tooling-react::navigation";
declare class Navigation extends Foundation<
    NavigationHandledProps & ManagedClasses<NavigationClassNameContract>,
    {},
    NavigationState
> {
    static displayName: string;
    static defaultProps: NavigationHandledProps &
        ManagedClasses<NavigationClassNameContract>;
    protected handledProps: HandledProps<NavigationHandledProps>;
    private messageSystemConfig;
    private rootElement;
    constructor(props: NavigationProps);
    render(): React.ReactNode;
    componentWillUnmount(): void;
    private getActiveConfigIds;
    /**
     * Handle messages from the message system
     */
    private handleMessageSystem;
    private renderDictionaryItem;
    private renderNavigationConfig;
    private renderTrigger;
    private renderContent;
    private isEditable;
    private shouldTriggerRender;
    private getExpandedState;
    private getUpdatedElementsExpanded;
    private getParentElement;
    private getDraggableItemClassName;
    /**
     * Handler for the beginning of the drag
     * - This method removes the dragging item from the data
     */
    private handleDragStart;
    private handleDragEnd;
    private handleDragHover;
    /**
     * Handle clicks on a navigation item
     */
    private handleNavigationItemClick;
    /**
     * Update the active item
     */
    private handleNavigationItemSingleClick;
    /**
     * Allows editing of the active item
     */
    private handleNavigationItemDoubleClick;
    /**
     * Update the active items display text
     */
    private handleNavigationItemChangeDisplayText;
    /**
     * Update the active items display text focus state
     */
    private handleNavigationItemBlurDisplayTextInput;
    /**
     * Handles key up on the active items display text
     */
    private handleNavigationItemKeyDownDisplayTextInput;
    /**
     * Update an items expandable state
     */
    private handleNavigationItemExpandClick;
    private triggerExpandCollapse;
    private triggerNavigationEdit;
    private triggerNavigationUpdate;
    private findCurrentTreeItemIndex;
    private focusNextTreeItem;
    private focusPreviousTreeItem;
    private focusFirstTreeItem;
    private focusLastTreeItem;
    private focusAndOpenTreeItems;
    private focusAndCloseTreeItems;
    private getTreeItemNodes;
    /**
     * Handles key up on a tree item
     */
    private handleNavigationItemKeyDown;
}
export { Navigation };
declare const _default: React.ComponentClass<
    import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
        NavigationHandledProps & FoundationProps,
        NavigationClassNameContract,
        {}
    >,
    any
>;
export default _default;
