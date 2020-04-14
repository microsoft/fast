import React from "react";
import { camelCase, get, isEqual, isNil } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    CSSProperties,
    CSSPropertyEditorHandledProps,
    CSSPropertyEditorProps,
    CSSPropertyEditorState,
    CSSPropertyEditorUnhandledProps,
} from "./property-editor.props";
import PropertyEditorRow from "./property-editor-row";
import { canUseDOM } from "exenv-es6";
import { keyCodeEnter, keyCodeTab } from "@microsoft/fast-web-utilities";

export default class CSSPropertyEditor extends Foundation<
    CSSPropertyEditorHandledProps,
    CSSPropertyEditorUnhandledProps,
    CSSPropertyEditorState
> {
    public static displayName: string = "CSSPropertyEditor";
    public static newRowKey: string = "newCSSEditorRow";

    protected handledProps: HandledProps<CSSPropertyEditorHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    // private newEditRowKeyName: string = "newCssPropertyEditorEditRow";
    private propertyEditorRef: React.RefObject<HTMLDivElement>;
    private editData: CSSProperties;
    private submittedEditData: CSSProperties;
    private activeEditRowReactKey: string;
    private activeEditRowIndex: number;
    private newRowKeyCounter: number;

    constructor(props: CSSPropertyEditorProps) {
        super(props);

        this.propertyEditorRef = React.createRef();
        this.activeEditRowIndex = -1;
        this.newRowKeyCounter = 0;
        this.activeEditRowReactKey = null;
        this.editData = isNil(this.props.data) ? {} : Object.assign({}, this.props.data);
        this.submittedEditData = isNil(this.props.data)
            ? {}
            : Object.assign({}, this.props.data);
        this.state = {
            activeRowUncommittedCSSName: null,
        };
    }

    public componentDidUpdate(prevProps: CSSPropertyEditorProps): void {
        if (
            !isEqual(this.props.data, prevProps.data) &&
            !isEqual(this.props.data, this.submittedEditData)
        ) {
            // if we don't recognize data props treat as a reset
            this.editData = isNil(this.props.data)
                ? {}
                : Object.assign({}, this.props.data);
            this.submittedEditData = isNil(this.props.data)
                ? {}
                : Object.assign({}, this.props.data);
            this.setState({
                activeRowUncommittedCSSName: null,
            });
        }
    }

    /**
     * Render the component
     */
    public render(): React.ReactNode {
        return (
            <div
                onClick={this.handleClick}
                tabIndex={Object.keys(this.editData).length === 0 ? 0 : -1}
                onFocus={
                    Object.keys(this.editData).length === 0 ? this.handleEmptyFocus : null
                }
                className={this.props.managedClasses.cssPropertyEditor}
                ref={this.propertyEditorRef}
            >
                <pre
                    className={this.props.managedClasses.cssPropertyEditor_propertyRegion}
                >
                    {this.renderRows()}
                </pre>
            </div>
        );
    }

    /**
     * Render all rows
     */
    private renderRows(): React.ReactNode {
        if (isNil(this.editData)) {
            return;
        }

        return Object.keys(this.editData).map(
            (cssKey: string, index: number): React.ReactNode => {
                return this.renderRow(cssKey, index);
            }
        );
    }

    /**
     * Render a single row
     */
    private renderRow = (cssKey: string, index: number): React.ReactNode => {
        const itemKey: string = this.getItemKey(cssKey, index);

        const editKey: string =
            this.activeEditRowIndex === index &&
            this.state.activeRowUncommittedCSSName !== null
                ? this.state.activeRowUncommittedCSSName
                : cssKey;

        return (
            <PropertyEditorRow
                key={itemKey}
                cssPropertyName={editKey}
                value={this.editData[cssKey]}
                rowIndex={index}
                onValueChange={this.handleValueChange}
                onPropertyNameChange={this.handleKeyChange}
                onClickOutside={this.handleClickOutside}
                onCommitPropertyNameEdit={this.handleCommitKeyEdit}
                onValueInputKeyDown={this.handleValueInputKeyDown}
                onRowBlur={this.handleRowBlur}
                onRowFocus={this.handleRowFocus}
                managedClasses={{
                    cssPropertyEditorRow: get(
                        this.props.managedClasses,
                        "cssPropertyEditor_row",
                        ""
                    ),
                    cssPropertyEditorRow_input: get(
                        this.props.managedClasses,
                        "cssPropertyEditor_input",
                        ""
                    ),
                    cssPropertyEditorRow_inputKey: get(
                        this.props.managedClasses,
                        "cssPropertyEditor_inputKey",
                        ""
                    ),
                    cssPropertyEditorRow_inputValue: get(
                        this.props.managedClasses,
                        "cssPropertyEditor_inputValue",
                        ""
                    ),
                }}
            />
        );
    };

    /**
     * get an item key
     */
    private getItemKey = (cssKey: string, index: number): string => {
        let editKey: string = cssKey;
        if (this.activeEditRowIndex === index) {
            if (this.activeEditRowReactKey !== null) {
                editKey = this.activeEditRowReactKey;
            } else if (cssKey === "") {
                editKey = this.generateItemKey();
            } else {
                this.activeEditRowReactKey = cssKey;
            }
        }
        return editKey;
    };

    /**
     * generate a new item key
     */
    private generateItemKey = (): string => {
        this.newRowKeyCounter = this.newRowKeyCounter + 1;
        if (this.newRowKeyCounter > 100) {
            this.newRowKeyCounter = 1;
        }
        this.activeEditRowReactKey = `${CSSPropertyEditor.newRowKey}${this.newRowKeyCounter}`;
        return this.activeEditRowReactKey;
    };

    /**
     * CSS key has changed in a row input
     */
    private handleKeyChange = (
        newkey: string,
        oldKey: string,
        rowIndex: number
    ): void => {
        this.setState({
            activeRowUncommittedCSSName: newkey,
        });
    };

    /**
     * A value has changed in a row input
     */
    private handleValueChange = (
        newValue: string,
        rowKey: string,
        rowIndex: number
    ): void => {
        const newData: CSSProperties = {};

        // The reason this is iterated over in this manner is to preserve
        // the order of keys in the CSS object
        Object.keys(this.editData).forEach((key: string, index: number) => {
            newData[key] = index === rowIndex ? newValue : this.editData[key];
        });

        this.editData = newData;
        this.activeEditRowIndex = rowIndex;
        this.handleCSSUpdate(newData);
    };

    /**
     * Commits a key change to data
     */
    private commitCSSKeyEdit = (): void => {
        if (this.state.activeRowUncommittedCSSName === null) {
            return;
        }
        const newData: CSSProperties = {};

        // The reason this is iterated over in this manner is to preserve
        // the order of keys in the CSS object
        Object.keys(this.editData).forEach((key: string, index: number) => {
            if (index === this.activeEditRowIndex) {
                newData[
                    camelCase(this.state.activeRowUncommittedCSSName)
                ] = this.editData[key];
            } else {
                newData[key] = this.editData[key];
            }
        });

        this.editData = newData;
        this.setState({
            activeRowUncommittedCSSName: null,
        });

        this.handleCSSUpdate(newData);
    };

    /**
     * Row gained focus
     */
    private handleRowFocus = (rowKey: string, rowIndex: number): void => {
        if (this.activeEditRowIndex !== rowIndex) {
            this.activeEditRowReactKey = null;
            this.activeEditRowIndex = rowIndex;
        }
    };

    /**
     * Key input has lost focus
     */
    private handleCommitKeyEdit = (rowKey: string, rowIndex: number): void => {
        if (this.state.activeRowUncommittedCSSName !== null) {
            if (this.state.activeRowUncommittedCSSName === "") {
                this.deleteRow(rowIndex);
            } else {
                this.commitCSSKeyEdit();
            }
        } else if (rowKey === "") {
            this.deleteRow(rowIndex);
        }
    };

    /**
     * Row has lost focus
     */
    private handleRowBlur = (rowKey: string, rowIndex: number): void => {
        if (this.activeEditRowIndex !== rowIndex) {
            return;
        }
        if (this.editData[rowKey] === "") {
            this.deleteRow(rowIndex);
        }
        this.activeEditRowReactKey = null;
        this.activeEditRowIndex = -1;
        this.setState({
            activeRowUncommittedCSSName: null,
        });
    };

    /**
     * Clicks on a row outside the inputs add a row following that row
     */
    private handleClickOutside = (rowKey: string, rowIndex: number): void => {
        this.createRow(rowIndex + 1);
    };

    /**
     * Add a row at the end of the list when there are clicks outside of an existing row
     */
    private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.defaultPrevented) {
            return;
        }

        this.createRow(
            !isNil(this.propertyEditorRef.current) &&
                e.nativeEvent.offsetY < this.propertyEditorRef.current.clientHeight / 2
                ? 0
                : Object.keys(this.editData).length
        );
    };

    /**
     * key was pressed on value editor input
     */
    private handleValueInputKeyDown = (
        rowKey: string,
        rowIndex: number,
        event: React.KeyboardEvent
    ): void => {
        const rowCount: number = Object.keys(this.editData).length;
        switch (event.keyCode) {
            case keyCodeEnter:
                if (rowIndex < rowCount - 1) {
                    // focus on the next row
                    this.focusOnRow(rowIndex + 1);
                    event.preventDefault();
                } else if (this.editData[rowKey] !== "") {
                    // create a new row if the current one is valid
                    this.createRow(rowCount);
                    event.preventDefault();
                }
                return;

            case keyCodeTab:
                if (
                    !event.shiftKey &&
                    rowIndex === rowCount - 1 &&
                    this.editData[rowKey] !== ""
                ) {
                    // create a new row if the current one is valid
                    this.createRow(rowCount);
                    event.preventDefault();
                }
                return;
        }
    };

    /**
     * Focus on the key input of the next row
     */
    private focusOnRow = (index: number): void => {
        const rows: Element[] = this.domChildren(
            (this.propertyEditorRef.current as HTMLElement)
                .firstElementChild as HTMLElement
        );
        if (rows.length < index + 1) {
            return;
        }
        const focusRow: HTMLElement = rows[index] as HTMLElement;
        const focusInput: HTMLElement = this.domChildren(focusRow)[0] as HTMLElement;
        focusInput.focus();
    };

    /**
     * Return an array of all elements that are children
     * of the root element
     */
    private domChildren(element: HTMLElement): Element[] {
        return canUseDOM() && element instanceof HTMLElement
            ? Array.from(element.children)
            : [];
    }

    /**
     * Component got focus without any data rows, so add an empty one
     */
    private handleEmptyFocus = (): void => {
        this.createRow(0);
    };

    /**
     * Create a new row at the insertion index
     * Retains keys for existing elements
     */
    private createRow = (insertionIndex: number): void => {
        if (this.activeEditRowIndex !== -1) {
            const activeRowKey: string = Object.keys(this.editData)[
                this.activeEditRowIndex
            ];
            const activeRowIndex: number = this.activeEditRowIndex;
            this.handleRowBlur(activeRowKey, this.activeEditRowIndex);
            // if the active row was delected we may need to adjust the insertion index
            if (
                Object.keys(this.editData).indexOf(activeRowKey) === -1 &&
                insertionIndex > activeRowIndex
            ) {
                insertionIndex = insertionIndex - 1;
            }
        }

        const newData: CSSProperties = {};
        const keys: string[] = Object.keys(this.editData);

        for (let i: number = 0, keysLength: number = keys.length; i <= keysLength; i++) {
            if (i === insertionIndex) {
                newData[""] = "";
            } else if (i < insertionIndex) {
                const key: string = keys[i];
                newData[key] = this.editData[key];
            } else {
                const key: string = keys[i - 1];
                newData[key] = this.editData[key];
            }
        }

        this.activeEditRowIndex = insertionIndex;
        this.activeEditRowReactKey = null;
        this.editData = newData;
        this.forceUpdate();
    };

    /**
     * Delete the new row at the deletion index
     */
    private deleteRow = (deletionIndex: number): void => {
        const newData: CSSProperties = {};

        Object.keys(this.editData).forEach((key: string, index: number) => {
            if (index !== deletionIndex) {
                newData[key] = this.editData[key];
            }
        });

        this.editData = newData;

        if (deletionIndex === this.activeEditRowIndex) {
            this.setState({
                activeRowUncommittedCSSName: null,
            });
            this.activeEditRowIndex = -1;
        }

        this.handleCSSUpdate(newData);
    };

    /**
     * data has changed, invoke onChange to update the parent
     */
    private handleCSSUpdate = <D extends {}>(updatedCSS: D): void => {
        if (
            typeof this.props.onChange === "function" &&
            !isEqual(updatedCSS, this.props.data)
        ) {
            this.submittedEditData = Object.assign({}, updatedCSS);
            this.props.onChange(Object.assign({}, updatedCSS));
        }
    };
}
