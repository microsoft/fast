import React from "react";
import { keyCodeEnter, keyCodeTab } from "@microsoft/fast-web-utilities";
import { getDataFromSchema } from "@microsoft/fast-tooling";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.linked-data.style";
import { DragItem } from "../templates";
import { LinkedDataActionType } from "../templates/types";
/**
 * Form control definition
 */
class LinkedDataControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleDragStart = () => {
            this.setState({
                isDragging: true,
                data: [].concat(this.props.value || []),
            });
        };
        this.handleDragEnd = () => {
            this.setState({
                isDragging: false,
            });
        };
        this.handleItemClick = id => {
            return index => {
                return e => {
                    this.props.onUpdateSection(id);
                };
            };
        };
        this.handleRemoveItem = (type, index) => {
            return e => {
                this.props.onChange({
                    value: this.props.value.splice(index, 1),
                    isLinkedData: true,
                    linkedDataAction: LinkedDataActionType.remove,
                });
            };
        };
        this.handleMoveItem = (sourceIndex, targetIndex) => {
            const currentData = [].concat(this.props.value);
            if (sourceIndex !== targetIndex) {
                currentData.splice(targetIndex, 0, currentData.splice(sourceIndex, 1)[0]);
            }
            this.setState({
                data: currentData,
            });
        };
        this.handleDropItem = () => {
            this.props.onChange({
                value: this.state.data,
                isLinkedData: true,
                linkedDataAction: LinkedDataActionType.reorder,
            });
        };
        this.handleLinkedDataKeydown = e => {
            if (e.target === e.currentTarget) {
                // Enter adds linked data if the input value matches a schema lazily or exactly
                if (e.keyCode === keyCodeEnter) {
                    e.preventDefault();
                    const normalizedValue = e.currentTarget.value.toLowerCase();
                    if (
                        this.lazyMatchValueWithASingleSchema(normalizedValue) ||
                        this.matchExactValueWithASingleSchema(e.currentTarget.value)
                    ) {
                        this.addLinkedData(normalizedValue, e.currentTarget.value);
                        /**
                         * Adding items to the linked data causes the items to
                         * move the input down while the datalist remains in the same location,
                         * to prevent the datalist from overlapping the input
                         * the datalist is dismissed by defocusing and refocusing the input
                         */
                        e.target.blur();
                        e.target.focus();
                        this.setState({
                            searchTerm: "",
                        });
                    }
                    // Tab performs an auto-complete if there is a single schema it can match to
                } else if (e.keyCode === keyCodeTab) {
                    const normalizedValue = e.currentTarget.value.toLowerCase();
                    const matchedSchema = this.lazyMatchValueWithASingleSchema(
                        normalizedValue
                    );
                    if (typeof matchedSchema === "string") {
                        // prevent navigating away by tab when single schema matched
                        e.preventDefault();
                        this.setState({
                            searchTerm: this.props.schemaDictionary[matchedSchema].title,
                        });
                    }
                }
            }
        };
        /**
         * Change handler for editing the search term filter
         */
        this.handleSearchTermUpdate = e => {
            this.setState({
                searchTerm: e.target.value,
            });
        };
        this.state = {
            searchTerm: "",
            isDragging: false,
            data: [].concat(props.value || []),
        };
    }
    render() {
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
    renderAddLinkedData() {
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
                        placeholder={this.props.strings.linkedDataPlaceholder}
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
    renderFilteredLinkedDataOptions() {
        return Object.entries(this.props.schemaDictionary).map(([key, value]) => {
            return <option key={key} value={value.title} />;
        });
    }
    /**
     * Render the list of existing linkedData for a component
     */
    renderExistingLinkedData() {
        const childItems = this.renderExistingLinkedDataItem();
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
    renderExistingLinkedDataItem() {
        if (Array.isArray(this.props.value)) {
            const {
                linkedDataControl_existingLinkedDataItem,
                linkedDataControl_existingLinkedDataItemLink,
                linkedDataControl_deleteButton,
            } = this.props.managedClasses;
            return (this.state.isDragging ? this.state.data : this.props.value).map(
                (value, index) => {
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
                            strings={this.props.strings}
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
    lazyMatchValueWithASingleSchema(value) {
        const matchingSchemas = Object.keys(this.props.schemaDictionary).reduce(
            (previousValue, currentValue) => {
                if (
                    this.props.schemaDictionary[currentValue].title
                        .toLowerCase()
                        .includes(value)
                ) {
                    return previousValue.concat([currentValue]);
                }
                return previousValue;
            },
            []
        );
        if (matchingSchemas.length === 1) {
            return matchingSchemas[0];
        }
    }
    matchExactValueWithASingleSchema(value) {
        return Object.keys(this.props.schemaDictionary).find(schemaDictionaryKey => {
            return value === this.props.schemaDictionary[schemaDictionaryKey].title;
        });
    }
    addLinkedData(normalizedValue, originalValue) {
        const matchedNormalizedValue = this.lazyMatchValueWithASingleSchema(
            normalizedValue
        );
        const matchedOriginalValue = this.matchExactValueWithASingleSchema(originalValue);
        const schemaId = matchedNormalizedValue || matchedOriginalValue;
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
    getLinkedDataInputId() {
        return `${this.props.dataLocation}-input`;
    }
}
LinkedDataControl.displayName = "LinkedDataControl";
LinkedDataControl.defaultProps = {
    managedClasses: {},
};
export { LinkedDataControl };
export default manageJss(styles)(LinkedDataControl);
