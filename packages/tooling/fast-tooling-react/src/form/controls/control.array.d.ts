import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import React from "react";
import { ArrayControlClassNameContract } from "./control.array.style";
import { ArrayControlProps, ArrayControlState } from "./control.array.props";
/**
 * Form control definition
 */
declare class ArrayControl extends React.Component<
    ArrayControlProps & ManagedClasses<ArrayControlClassNameContract>,
    ArrayControlState
> {
    static displayName: string;
    static defaultProps: Partial<
        ArrayControlProps & ManagedClasses<ArrayControlClassNameContract>
    >;
    constructor(props: ArrayControlProps);
    render(): React.ReactNode;
    /**
     * Render a button for adding an item to the array
     */
    private renderAddArrayItemTrigger;
    /**
     * Render an add array item section
     */
    private renderAddArrayItem;
    /**
     * Renders an default array link item
     */
    private renderDefaultArrayLinkItem;
    /**
     * Renders default array items
     */
    private renderDefaultArrayLinkItems;
    /**
     * Renders the links to an array section to be activated
     */
    private renderExistingArrayItems;
    /**
     * Render UI for all items in an array
     */
    private renderArrayLinkItems;
    private renderValidationError;
    /**
     * Array add/remove item click handler factory
     */
    private arrayItemClickHandlerFactory;
    /**
     * Array section link click handler factory
     */
    private arrayClickHandlerFactory;
    /**
     * Handles adding an array item
     */
    private handleAddArrayItem;
    /**
     * Handles removing an array item
     */
    private handleRemoveArrayItem;
    /**
     * Handle the start of the drag action
     */
    private handleDragStart;
    /**
     * Handle the end of the drag action
     */
    private handleDragEnd;
    /**
     * Handle moving the drag item
     */
    private handleMoveDragItem;
    /**
     * Handle dropping the drag item
     * Triggers the onChange
     */
    private handleDropDragItem;
}
export { ArrayControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, ArrayControlClassNameContract, {}>,
    any
>;
export default _default;
