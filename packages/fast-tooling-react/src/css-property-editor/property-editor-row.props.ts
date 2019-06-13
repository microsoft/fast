import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface CSSPropertyEditorRowClassNameContract {
    cssPropertyEditorRow?: string;
    cssPropertyEditorRow_input?: string;
    cssPropertyEditorRow_inputKey?: string;
    cssPropertyEditorRow_inputValue?: string;
}

export interface CSSPropertyEditorRowUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSPropertyEditorRowHandledProps
    extends ManagedClasses<CSSPropertyEditorRowClassNameContract> {
    /**
     * The key associated with the value being edited
     */
    rowIndex: number;

    /**
     * The key associated with the value being edited
     */
    cssKey: string;

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
    onKeyChange: (newkey: string, oldKey: string, rowIndex: number) => void;

    /**
     * Key input has lost focus
     */
    onKeyInputBlur: (rowKey: string, rowIndex: number) => void;

    /**
     * Called when mouse click outside the inputs
     */
    onClickToInsert: (rowKey: string, rowIndex: number) => void;

    /**
     *  Called when row gains focus
     */
    onRowFocus: (rowKey: string, rowIndex: number) => void;

    /**
     *  Called when row loses focus
     */
    onRowBlur: (rowKey: string, rowIndex: number) => void;
}

export type CSSPropertyEditorRowProps = CSSPropertyEditorRowHandledProps &
    CSSPropertyEditorRowUnhandledProps;
