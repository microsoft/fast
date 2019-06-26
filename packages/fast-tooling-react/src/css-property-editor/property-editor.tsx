import React from "react";
import { get, isEqual, isNil } from "lodash-es";
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
    private currentEditRowReactKey: string;
    private currentEditRowIndex: number;
    private newRowKeyCounter: number;

    constructor(props: CSSPropertyEditorProps) {
        super(props);

        this.propertyEditorRef = React.createRef();
        this.currentEditRowIndex = -1;
        this.newRowKeyCounter = 0;
        this.currentEditRowReactKey = null;
        this.editData = isNil(this.props.data) ? {} : Object.assign({}, this.props.data);
        this.state = {
            activeRowUncommittedCSSName: null,
        };
    }

    public componentDidUpdate(prevProps: CSSPropertyEditorProps): void {
        if (
            !isEqual(this.props.data, prevProps.data) &&
            !isEqual(this.props.data, this.editData)
        ) {
            // if we don't recognize data props treat as a reset
            this.editData = isNil(this.props.data)
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
        let itemKey: string = cssKey;

        if (this.currentEditRowIndex === index) {
            if (this.currentEditRowReactKey !== null) {
                itemKey = this.currentEditRowReactKey;
            } else if (cssKey === "") {
                itemKey = this.generateItemKey();
            } else {
                this.currentEditRowReactKey = cssKey;
            }
        }

        const editKey: string =
            this.currentEditRowIndex === index &&
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
                onClickOutside={this.handleClickToInsert}
                onCommitPropertyNameEdit={this.handleCommitKeyEdit}
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
     * generate a new item key
     */
    private generateItemKey = (): string => {
        this.newRowKeyCounter = this.newRowKeyCounter + 1;
        if (this.newRowKeyCounter > 100) {
            this.newRowKeyCounter = 1;
        }
        this.currentEditRowReactKey = `${CSSPropertyEditor.newRowKey}${
            this.newRowKeyCounter
        }`;
        return this.currentEditRowReactKey;
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
            if (index === rowIndex) {
                newData[key] = newValue;
            } else {
                newData[key] = this.editData[key];
            }
        });

        this.editData = newData;
        this.currentEditRowIndex = rowIndex;
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
            if (index === this.currentEditRowIndex) {
                newData[this.state.activeRowUncommittedCSSName] = this.editData[key];
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
        if (this.currentEditRowIndex !== rowIndex) {
            this.currentEditRowReactKey = null;
            this.currentEditRowIndex = rowIndex;
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
        if (this.currentEditRowIndex !== -1 && this.editData[rowKey] === "") {
            this.deleteRow(rowIndex);
        }
        this.currentEditRowReactKey = null;
        this.setState({
            activeRowUncommittedCSSName: null,
        });
    };

    /**
     * Clicks on a row outside the inputs add a row following that row
     */
    private handleClickToInsert = (rowKey: string, rowIndex: number): void => {
        this.createRow(rowIndex + 1);
    };

    /**
     * Add a row at the end of the list when there are clicks outside of an existing row
     */
    private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.defaultPrevented) {
            return;
        }
        this.createRow(Object.keys(this.editData).length);
    };

    /**
     * Component got focus without any data rows, so add an empty one
     */
    private handleEmptyFocus = (): void => {
        this.createRow(0);
    };

    /**
     * Create a new row at the insertion index
     */
    private createRow = (insertionIndex: number): void => {
        const newData: CSSProperties = {};
        const keys: string[] = Object.keys(this.editData);

        for (let i: number = 0; i <= keys.length; i = i + 1) {
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

        this.currentEditRowIndex = insertionIndex;
        this.currentEditRowReactKey = null;
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

        if (deletionIndex === this.currentEditRowIndex) {
            this.setState({
                activeRowUncommittedCSSName: null,
            });
            this.currentEditRowIndex = -1;
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
            this.props.onChange(updatedCSS);
        }
    };
}
