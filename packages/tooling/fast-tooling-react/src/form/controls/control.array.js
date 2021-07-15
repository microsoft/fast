import { uniqueId } from "lodash-es";
import manageJss from "@microsoft/fast-jss-manager-react";
import React from "react";
import { getArrayLinks } from "./utilities/form";
import styles from "./control.array.style";
import { DragItem } from "../templates";
import { ArrayAction } from "../templates/types";
import { classNames } from "@microsoft/fast-web-utilities";
/**
 * Form control definition
 */
class ArrayControl extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Renders an default array link item
         */
        this.renderDefaultArrayLinkItem = (value, index) => {
            const {
                arrayControl_existingItemListItem,
                arrayControl_existingItemListItemLink,
                arrayControl_existingItemListItemLink__default,
            } = this.props.managedClasses;
            return (
                <li
                    className={arrayControl_existingItemListItem}
                    key={`item-${index}`}
                    id={uniqueId(index.toString())}
                >
                    <span
                        className={classNames(
                            arrayControl_existingItemListItemLink,
                            arrayControl_existingItemListItemLink__default
                        )}
                    >
                        {value}
                    </span>
                </li>
            );
        };
        /**
         * Array add/remove item click handler factory
         */
        this.arrayItemClickHandlerFactory = (type, index) => {
            return e => {
                e.preventDefault();
                type === ArrayAction.add
                    ? this.handleAddArrayItem()
                    : this.handleRemoveArrayItem(index);
            };
        };
        /**
         * Array section link click handler factory
         */
        this.arrayClickHandlerFactory = index => {
            return e => {
                e.preventDefault();
                this.props.onUpdateSection(
                    this.props.dictionaryId,
                    this.props.navigation[this.props.navigationConfigId].items[index]
                );
            };
        };
        /**
         * Handle the start of the drag action
         */
        this.handleDragStart = () => {
            this.setState({
                isDragging: true,
                data: [].concat(this.props.value || []),
            });
        };
        /**
         * Handle the end of the drag action
         */
        this.handleDragEnd = () => {
            this.setState({
                isDragging: false,
            });
        };
        /**
         * Handle moving the drag item
         */
        this.handleMoveDragItem = (sourceIndex, targetIndex) => {
            const currentData = [].concat(this.props.value);
            if (sourceIndex !== targetIndex) {
                currentData.splice(targetIndex, 0, currentData.splice(sourceIndex, 1)[0]);
            }
            this.setState({
                data: currentData,
            });
        };
        /**
         * Handle dropping the drag item
         * Triggers the onChange
         */
        this.handleDropDragItem = () => {
            this.props.onChange({ value: this.state.data });
        };
        this.state = {
            data: props.value,
            isDragging: false,
        };
    }
    render() {
        return (
            <div
                className={classNames(
                    this.props.managedClasses.arrayControl,
                    [
                        this.props.managedClasses.arrayControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.arrayControl__invalid,
                        this.props.invalidMessage !== "",
                    ]
                )}
            >
                {this.renderAddArrayItem()}
                {this.renderExistingArrayItems()}
            </div>
        );
    }
    /**
     * Render a button for adding an item to the array
     */
    renderAddArrayItemTrigger() {
        return (
            <button
                className={this.props.managedClasses.arrayControl_addItemButton}
                aria-label={this.props.strings.arrayAddItemTip}
                onClick={this.arrayItemClickHandlerFactory(ArrayAction.add)}
            />
        );
    }
    /**
     * Render an add array item section
     */
    renderAddArrayItem() {
        const existingItemLength = Array.isArray(this.props.value)
            ? this.props.value.length
            : 0;
        const {
            arrayControl_addItem,
            arrayControl_addItemLabel,
        } = this.props.managedClasses;
        if (this.props.maxItems > existingItemLength) {
            return (
                <div className={arrayControl_addItem}>
                    <div className={arrayControl_addItemLabel}>
                        {this.props.strings.arrayAddItemLabel}
                    </div>
                    {this.renderAddArrayItemTrigger()}
                </div>
            );
        }
    }
    /**
     * Renders default array items
     */
    renderDefaultArrayLinkItems() {
        return getArrayLinks(this.props.default).map((value, index) => {
            return this.renderDefaultArrayLinkItem(value, index);
        });
    }
    /**
     * Renders the links to an array section to be activated
     */
    renderExistingArrayItems() {
        const hasData = Array.isArray(this.props.value);
        const hasDefault = Array.isArray(this.props.default);
        if (hasData) {
            return (
                <ul className={this.props.managedClasses.arrayControl_existingItemList}>
                    {this.renderArrayLinkItems()}
                </ul>
            );
        }
        if (hasDefault) {
            return (
                <ul className={this.props.managedClasses.arrayControl_existingItemList}>
                    {this.renderDefaultArrayLinkItems()}
                </ul>
            );
        }
        return (
            <ul className={this.props.managedClasses.arrayControl_existingItemList}></ul>
        );
    }
    /**
     * Render UI for all items in an array
     */
    renderArrayLinkItems() {
        const data = this.state.isDragging ? this.state.data : this.props.value;
        const {
            arrayControl_existingItemRemoveButton,
            arrayControl_existingItemListItem,
            arrayControl_existingItemListItem__invalid,
            arrayControl_existingItemListItemLink,
        } = this.props.managedClasses;
        return getArrayLinks(data).map((text, index) => {
            const invalidError = this.renderValidationError(index);
            return (
                <React.Fragment key={this.props.dataLocation + index}>
                    <DragItem
                        key={index}
                        index={index}
                        minItems={this.props.minItems}
                        itemLength={getArrayLinks(data).length}
                        itemRemoveClassName={arrayControl_existingItemRemoveButton}
                        itemClassName={classNames(arrayControl_existingItemListItem, [
                            arrayControl_existingItemListItem__invalid,
                            invalidError !== null,
                        ])}
                        itemLinkClassName={arrayControl_existingItemListItemLink}
                        removeDragItem={this.arrayItemClickHandlerFactory}
                        onClick={this.arrayClickHandlerFactory}
                        moveDragItem={this.handleMoveDragItem}
                        dropDragItem={this.handleDropDragItem}
                        dragStart={this.handleDragStart}
                        dragEnd={this.handleDragEnd}
                        strings={this.props.strings}
                    >
                        {text}
                    </DragItem>
                    {!!this.props.displayValidationInline ? invalidError : null}
                </React.Fragment>
            );
        });
    }
    renderValidationError(index) {
        if (typeof this.props.validationErrors === "undefined") {
            return null;
        }
        for (const error of this.props.validationErrors) {
            if (error.dataLocation.startsWith(`${this.props.dataLocation}.${index}`)) {
                return (
                    <div
                        className={this.props.managedClasses.arrayControl_invalidMessage}
                    >
                        {error.invalidMessage}
                    </div>
                );
            }
        }
        return null;
    }
    /**
     * Handles adding an array item
     */
    handleAddArrayItem() {
        if (typeof this.props.value === "undefined") {
            this.props.onChange({ value: [this.props.onAddExampleData("items")] });
        } else {
            this.props.onChange({
                value: this.props.onAddExampleData("items"),
                isArray: true,
            });
        }
    }
    /**
     * Handles removing an array item
     */
    handleRemoveArrayItem(index) {
        this.props.onChange({ value: void 0, isArray: true, index });
    }
}
ArrayControl.displayName = "ArrayControl";
ArrayControl.defaultProps = {
    managedClasses: {},
};
export { ArrayControl };
export default manageJss(styles)(ArrayControl);
