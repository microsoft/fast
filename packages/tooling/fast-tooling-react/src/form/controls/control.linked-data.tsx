import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import React from "react";
import { keyCodeEnter } from "@microsoft/fast-web-utilities";
import { getDataFromSchema } from "@microsoft/fast-tooling";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import styles, { LinkedDataControlClassNameContract } from "./control.linked-data.style";
import {
    LinkedDataControlProps,
    LinkedDataControlState,
} from "./control.linked-data.props";
import { DragItem } from "../templates";
import { ArrayAction, LinkedDataActionType } from "../templates/types";

/**
 * Form control definition
 */
class LinkedDataControl extends React.Component<
    LinkedDataControlProps & ManagedClasses<LinkedDataControlClassNameContract>,
    LinkedDataControlState
> {
    public static displayName: string = "LinkedDataControl";

    public static defaultProps: Partial<
        LinkedDataControlProps & ManagedClasses<LinkedDataControlClassNameContract>
    > = {
        managedClasses: {},
    };

    constructor(
        props: LinkedDataControlProps & ManagedClasses<LinkedDataControlClassNameContract>
    ) {
        super(props);

        this.state = {
            searchTerm: "",
            isDragging: false,
            data: [].concat(props.value || []),
        };
    }

    public render(): React.ReactNode {
        // Convert to search component when #3006 has been completed
        return (
            <div className={this.props.managedClasses.linkedDataControl}>
                {this.renderExistingLinkedData()}
                {this.renderAddLinkedData()}
            </div>
        );
    }

    /**
     * Render the UI for adding linked data
     */
    private renderAddLinkedData(): React.ReactNode {
        return (
            <div
                className={
                    this.props.managedClasses.linkedDataControl_linkedDataListControl
                }
            >
                <span
                    className={
                        this.props.managedClasses
                            .linkedDataControl_linkedDataListInputRegion
                    }
                >
                    <input
                        className={
                            this.props.managedClasses
                                .linkedDataControl_linkedDataListInput
                        }
                        type={"text"}
                        aria-autocomplete={"list"}
                        list={this.getLinkedDataInputId()}
                        aria-controls={this.getLinkedDataInputId()}
                        value={this.state.searchTerm}
                        placeholder={"Add"}
                        onChange={this.handleSearchTermUpdate}
                        onKeyDown={this.handleLinkedDataKeydown}
                    />
                </span>
                <datalist id={this.getLinkedDataInputId()} role={"listbox"}>
                    {this.renderFilteredLinkedDataOptions()}
                </datalist>
            </div>
        );
    }

    private renderFilteredLinkedDataOptions(): React.ReactNode {
        return Object.entries(this.props.schemaDictionary).map(
            ([key, value]: [string, any]): React.ReactNode => {
                return <option key={key} value={value.title} />;
            }
        );
    }

    /**
     * Render the list of existing linkedData for a component
     */
    private renderExistingLinkedData(): React.ReactNode {
        const childItems: React.ReactNode = this.renderExistingLinkedDataItem();

        if (childItems) {
            return (
                <ul
                    className={
                        this.props.managedClasses.linkedDataControl_existingLinkedData
                    }
                >
                    {childItems}
                </ul>
            );
        }
    }

    private renderExistingLinkedDataItem(): React.ReactNode {
        if (Array.isArray(this.props.value)) {
            const {
                linkedDataControl_existingLinkedDataItem,
                linkedDataControl_existingLinkedDataItemLink,
                linkedDataControl_deleteButton,
            }: LinkedDataControlClassNameContract = this.props.managedClasses;

            return (this.state.isDragging ? this.state.data : this.props.value).map(
                (value: any, index: number) => {
                    return (
                        <DragItem
                            key={value + index}
                            itemClassName={linkedDataControl_existingLinkedDataItem}
                            itemLinkClassName={
                                linkedDataControl_existingLinkedDataItemLink
                            }
                            itemRemoveClassName={linkedDataControl_deleteButton}
                            minItems={0}
                            itemLength={1}
                            index={index}
                            onClick={this.handleItemClick(value.id)}
                            removeDragItem={this.handleRemoveItem}
                            moveDragItem={this.handleMoveItem}
                            dropDragItem={this.handleDropItem}
                            dragStart={this.handleDragStart}
                            dragEnd={this.handleDragEnd}
                        >
                            {
                                this.props.schemaDictionary[
                                    this.props.dataDictionary[0][value.id].schemaId
                                ].title
                            }
                        </DragItem>
                    );
                }
            );
        }
    }

    private handleDragStart = (): void => {
        this.setState({
            isDragging: true,
            data: [].concat(this.props.value || []),
        });
    };

    private handleDragEnd = (): void => {
        this.setState({
            isDragging: false,
        });
    };

    private handleItemClick = (
        id: string
    ): ((index: number) => (e: React.MouseEvent<HTMLAnchorElement>) => void) => {
        return (index: number): ((e: React.MouseEvent<HTMLAnchorElement>) => void) => {
            return (e: React.MouseEvent<HTMLAnchorElement>): void => {
                this.props.onUpdateSection(id);
            };
        };
    };

    private handleRemoveItem = (
        type: ArrayAction,
        index: number
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.props.onChange({
                value: this.props.value.splice(index, 1),
                isLinkedData: true,
                linkedDataAction: LinkedDataActionType.remove,
            });
        };
    };

    private handleMoveItem = (sourceIndex: number, targetIndex: number): void => {
        const currentData: unknown[] = [].concat(this.props.value);

        if (sourceIndex !== targetIndex) {
            currentData.splice(targetIndex, 0, currentData.splice(sourceIndex, 1)[0]);
        }

        this.setState({
            data: currentData,
        });
    };

    private handleDropItem = (): void => {
        this.props.onChange({
            value: this.state.data,
            isLinkedData: true,
            linkedDataAction: LinkedDataActionType.reorder,
        });
    };

    private handleLinkedDataKeydown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ): void => {
        if (e.keyCode === keyCodeEnter && e.target === e.currentTarget) {
            e.preventDefault();

            this.addLinkedData(e.currentTarget.value);

            /**
             * Adding items to the linked data causes the items to
             * move the input down while the datalist remains in the same location,
             * to prevent the datalist from overlapping the input
             * the datalist is dismissed by defocusing and refocusing the input
             */
            (e.target as HTMLElement).blur();
            (e.target as HTMLElement).focus();

            this.setState({
                searchTerm: "",
            });
        }
    };

    private matchValueWithSchema(value: string): string | void {
        return Object.keys(this.props.schemaDictionary).find(
            (schemaDictionaryKey: string) => {
                return value === this.props.schemaDictionary[schemaDictionaryKey].title;
            }
        );
    }

    /**
     * Change handler for editing the search term filter
     */
    private handleSearchTermUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            searchTerm: e.target.value,
        });
    };

    private addLinkedData(value: string): void {
        const schemaId: string | void = this.matchValueWithSchema(value);

        if (typeof schemaId !== "undefined") {
            this.props.onChange({
                value: [
                    {
                        schemaId,
                        parent: {
                            id: this.props.dictionaryId,
                            dataLocation: this.props.dataLocation,
                        },
                        data: getDataFromSchema(this.props.schemaDictionary[schemaId]),
                    },
                ],
                isLinkedData: true,
                linkedDataAction: LinkedDataActionType.add,
                index: Array.isArray(this.props.value) ? this.props.value.length : 0,
            });
        }
    }

    private getLinkedDataInputId(): string {
        return `${this.props.dataLocation}-input`;
    }
}

export { LinkedDataControl };
export default manageJss(styles)(LinkedDataControl);
