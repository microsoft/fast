import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface CSSPropertyEditorRowClassNameContract {
    cssPropertyEditorRow?: string;
    cssPropertyEditorRow_input?: string;
    cssPropertyEditorRow_inputKey?: string;
    cssPropertyEditorRow_inputValue?: string;
}

export type CSSPropertyEditorRowUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface CSSPropertyEditorRowHandledProps
    extends ManagedClasses<CSSPropertyEditorRowClassNameContract> {
    /**
     * The index of the row
     */
    rowIndex: number;

    /**
     * The name associated with the value being edited
     */
    cssPropertyName: string;

    /**
     * The value for the property being edited
     */
    value: string;

    /**
     * Called when the value changes
     */
    onValueChange: (newValue: string, rowKey: string, rowIndex: number) => void;

    /**
     * Called when the key value changes
     */
    onPropertyNameChange: (newkey: string, oldKey: string, rowIndex: number) => void;

    /**
     * Property name should be committed (name input loses focus, user hits enter)
     */
    onCommitPropertyNameEdit: (rowKey: string, rowIndex: number) => void;

    /**
     * Called when mouse click outside the inputs
     */
    onClickOutside: (rowKey: string, rowIndex: number) => void;

    /**
     *  Called when row gains focus
     */
    onRowFocus: (rowKey: string, rowIndex: number) => void;

    /**
     *  Called when row loses focus
     */
    onRowBlur: (rowKey: string, rowIndex: number) => void;

    /**
     *  Enter key press on value edit input
     */
    onValueInputKeyDown: (
        rowKey: string,
        rowIndex: number,
        event: React.KeyboardEvent
    ) => void;
}

export type CSSPropertyEditorRowProps = CSSPropertyEditorRowHandledProps &
    CSSPropertyEditorRowUnhandledProps;
