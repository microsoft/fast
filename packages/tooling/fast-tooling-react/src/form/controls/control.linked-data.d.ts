import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import React from "react";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { LinkedDataControlClassNameContract } from "./control.linked-data.style";
import {
    LinkedDataControlProps,
    LinkedDataControlState,
} from "./control.linked-data.props";
/**
 * Form control definition
 */
declare class LinkedDataControl extends React.Component<
    LinkedDataControlProps & ManagedClasses<LinkedDataControlClassNameContract>,
    LinkedDataControlState
> {
    static displayName: string;
    static defaultProps: Partial<
        LinkedDataControlProps & ManagedClasses<LinkedDataControlClassNameContract>
    >;
    constructor(
        props: LinkedDataControlProps & ManagedClasses<LinkedDataControlClassNameContract>
    );
    render(): React.ReactNode;
    /**
     * Render the UI for adding linked data
     */
    private renderAddLinkedData;
    private renderFilteredLinkedDataOptions;
    /**
     * Render the list of existing linkedData for a component
     */
    private renderExistingLinkedData;
    private renderExistingLinkedDataItem;
    private handleDragStart;
    private handleDragEnd;
    private handleItemClick;
    private handleRemoveItem;
    private handleMoveItem;
    private handleDropItem;
    private handleLinkedDataKeydown;
    private lazyMatchValueWithASingleSchema;
    private matchExactValueWithASingleSchema;
    /**
     * Change handler for editing the search term filter
     */
    private handleSearchTermUpdate;
    private addLinkedData;
    private getLinkedDataInputId;
}
export { LinkedDataControl };
declare const _default: React.ComponentClass<
    ManagedJSSProps<any, LinkedDataControlClassNameContract, {}>,
    any
>;
export default _default;
