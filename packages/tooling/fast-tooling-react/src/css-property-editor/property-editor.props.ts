import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface CSSPropertyEditorClassNameContract {
    cssPropertyEditor?: string;
    cssPropertyEditor_propertyRegion?: string;
    cssPropertyEditor_row?: string;
    cssPropertyEditor_input?: string;
    cssPropertyEditor_inputKey?: string;
    cssPropertyEditor_inputValue?: string;
}

export interface CSSProperties {
    [key: string]: string;
}

export type CSSPropertiesOnChange = (CSS: CSSProperties) => void;

export interface CSSPropertyEditorState {
    /**
     *  The uncommitted string for the key of the row currently being edited
     */
    activeRowUncommittedCSSName: string;
}

export type CSSPropertyEditorUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface CSSPropertyEditorHandledProps
    extends ManagedClasses<CSSPropertyEditorClassNameContract> {
    /**
     * The onChange event for updating the data
     */
    onChange?: CSSPropertiesOnChange;

    /**
     * The CSS data
     */
    data?: CSSProperties;
}

export type CSSPropertyEditorProps = CSSPropertyEditorHandledProps &
    CSSPropertyEditorUnhandledProps;
