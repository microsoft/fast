import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSPropertyEditorClassNameContract } from "./property-editor.style";

export interface CSSPropertyEditorState {
    /**
     * The currently editing property key
     */
    key: string;

    /**
     * The currently editing property value
     */
    value: string;

    /**
     * The data
     */
    data: CSSPropertiesConfig;
}

export interface CSSPropertyConfig {
    /**
     * The property value
     */
    value: string;

    /**
     * The property key width
     */
    keyWidth: number;

    /**
     * The property value width
     */
    valueWidth: number;
}

export interface CSSProperties {
    [key: string]: string;
}

export interface CSSPropertiesConfig {
    [key: string]: CSSPropertyConfig;
}

export type CSSPropertiesOnChange = (CSS: CSSProperties) => void;

export interface CSSPropertyEditorUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}

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
