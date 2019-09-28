import { AddExampleData } from "../form-section.props";
import { FormChildOptionItem } from "../form";

export enum BadgeType {
    warning = "warning",
    info = "info",
    locked = "locked",
}

export enum ArrayAction {
    add = "add",
    remove = "remove",
}

export type FormHTMLElement =
    | HTMLTextAreaElement
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLButtonElement;

export interface AbstractControlTemplateProps
    extends NumberTypeControlOptions,
        ListControlOptions,
        TextboxControlOptions,
        LinkControlOptions,
        ArrayControlOptions,
        ChildrenControlOptions {
    /**
     * The index to assign as a React key for mapping
     */
    index: number;

    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * The location of the data
     * in respect to the schema
     */
    schemaLocation: string;

    /**
     * The data
     */
    data: any;

    /**
     * Whether this item is required
     */
    required: boolean;

    /**
     * The label
     */
    label: string;

    /**
     * Whether this item is disabled
     */
    disabled?: boolean;

    /**
     * The passed onChange function
     */
    onChange: (
        dataLocation: string,
        value: any,
        isArray?: boolean,
        index?: number
    ) => void;

    /**
     * The update section callback
     */
    onUpdateSection: (schemaLocation: string, dataLocation: string, schema?: any) => void;

    /**
     * The default data (if available)
     */
    default?: any;

    /**
     * The const data (if available)
     */
    const?: any;

    /**
     * The badge to use next to a form items label
     */
    badge?: BadgeType;

    /**
     * The badge description which is used as an HTML title
     */
    badgeDescription?: string;

    /**
     * The validation message if the form item is invalid
     */
    invalidMessage: string;

    /**
     * Display the validation inline
     */
    displayValidationInline?: boolean;

    /**
     * Display the validation as browser default tooltips
     */
    displayValidationBrowserDefault?: boolean;

    /**
     * Enable soft remove
     * defaults to true
     */
    softRemove?: boolean;
}

export interface CommonControlConfig {
    /**
     * The location of the data referenced by lodash path syntax
     */
    dataLocation: string;

    /**
     * The value of the data to be assigned to the control
     */
    value: any;

    /**
     * The default value
     */
    default?: any;

    /**
     * The disabled flag for this control
     */
    disabled: boolean;

    /**
     * The ref belonging to the form element injected as part of the control
     */
    elementRef: React.Ref<FormHTMLElement>;

    /**
     * Callback for reporting validity on
     * the element that is assigned the ref
     */
    reportValidity: () => void;

    /**
     * Callback for updating validity on
     * the element that is assigned the ref
     */
    updateValidity: () => void;

    /**
     * Callback for handling the updating of the value
     */
    onChange: (value: any, isArray?: boolean, index?: number) => void;
}

export interface NumberTypeControlOptions {
    /**
     * The minimum value allowed
     */
    min?: number;

    /**
     * The maximum value allowed
     */
    max?: number;

    /**
     * The increment between steps
     */
    step?: number;
}

export interface ListControlOptions {
    /**
     * The select options
     */
    options?: any[];
}

export interface TextboxControlOptions {
    /**
     * The number of rows to assign to the textarea
     */
    rows?: number;
}

export interface LinkControlOptions {
    /**
     * The location of the data
     * in respect to the schema
     */
    schemaLocation?: string;

    /**
     * The validation message if the form item is invalid
     */
    invalidMessage?: string;

    /**
     * The label
     */
    label?: string;

    /**
     * The update section callback
     */
    onUpdateSection?: (
        schemaLocation: string,
        dataLocation: string,
        schema?: any
    ) => void;
}

export interface ArrayControlOptions {
    /**
     * The callback to add example data as an array item
     */
    onAddExampleData?: AddExampleData;

    /**
     * The minimum number of array items required
     */
    minItems?: number;

    /**
     * The maximum number of array items required
     */
    maxItems?: number;

    /**
     * The update section callback
     */
    onUpdateSection?: (
        schemaLocation: string,
        dataLocation: string,
        schema?: any
    ) => void;

    /**
     * The location of the data
     * in respect to the schema
     */
    schemaLocation?: string;

    /**
     * The validation message if the form item is invalid
     */
    invalidMessage?: string;
}

export interface ChildrenControlOptions {
    /**
     * The potential children to be added
     */
    childOptions?: FormChildOptionItem[];

    /**
     * The default children to be added
     */
    defaultChildOptions?: string[];

    /**
     * The update section callback
     */
    onUpdateSection?: (
        schemaLocation: string,
        dataLocation: string,
        schema?: any
    ) => void;
}

export type NumberTypeControlConfig = CommonControlConfig & NumberTypeControlOptions;
export type ListControlConfig = CommonControlConfig & ListControlOptions;
export type TextboxControlConfig = CommonControlConfig & TextboxControlOptions;
export type LinkControlConfig = CommonControlConfig & LinkControlOptions;
export type ArrayControlConfig = CommonControlConfig & ArrayControlOptions;
export type ChildrenControlConfig = CommonControlConfig & ChildrenControlOptions;
export type ControlConfig = CommonControlConfig &
    NumberTypeControlOptions &
    ListControlOptions &
    TextboxControlOptions &
    LinkControlOptions &
    ArrayControlOptions &
    ChildrenControlConfig;
