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

export interface UpdateSectionConfig {
    /**
     * The lodash path location of the data in the schema
     */
    schemaLocation: string;

    /**
     * The lodash path location of the data
     */
    dataLocation: string;

    /**
     * The JSON schema
     */
    schema?: any;
}

export interface OnChangeConfig extends ControlOnChangeConfig {
    /**
     * The lodash path location of the data
     */
    dataLocation: string;
}

export interface ControlOnChangeConfig {
    /**
     * The new value for the supplied data location
     */
    value: any;

    /**
     * Whether this data is an array
     */
    isArray?: boolean;

    /**
     * The index if this data is an array
     */
    index?: number;
}

export type FormHTMLElement =
    | HTMLTextAreaElement
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLButtonElement;

export interface ControlTemplateUtilitiesProps
    extends NumberFieldTypeControlOptions,
        ListControlOptions,
        TextareaControlOptions,
        SectionLinkControlOptions,
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
     * The schema
     */
    schema: any;

    /**
     * Whether this item is required
     */
    required: boolean;

    /**
     * The label
     */
    label: string;

    /**
     * The label tooltip
     */
    labelTooltip?: string;

    /**
     * Whether this item is disabled
     */
    disabled?: boolean;

    /**
     * The passed onChange function
     */
    onChange: (config: OnChangeConfig) => void;

    /**
     * The update section callback
     */
    onUpdateSection: (config: UpdateSectionConfig) => void;

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
     * The schema
     */
    schema: any;

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
    onChange: (config: ControlOnChangeConfig) => void;
}

export interface NumberFieldTypeControlOptions {
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

export interface TextareaControlOptions {
    /**
     * The number of rows to assign to the textarea
     */
    rows?: number;
}

export interface SectionLinkControlOptions {
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
    onUpdateSection?: (config: UpdateSectionConfig) => void;
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
    onUpdateSection?: (config: UpdateSectionConfig) => void;

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
    onUpdateSection?: (config: UpdateSectionConfig) => void;
}

export type NumberFieldTypeControlConfig = CommonControlConfig &
    NumberFieldTypeControlOptions;
export type ListControlConfig = CommonControlConfig & ListControlOptions;
export type TextareaControlConfig = CommonControlConfig & TextareaControlOptions;
export type SectionLinkControlConfig = CommonControlConfig & SectionLinkControlOptions;
export type ArrayControlConfig = CommonControlConfig & ArrayControlOptions;
export type ChildrenControlConfig = CommonControlConfig & ChildrenControlOptions;
export type ControlConfig = CommonControlConfig &
    NumberFieldTypeControlOptions &
    ListControlOptions &
    TextareaControlOptions &
    SectionLinkControlOptions &
    ArrayControlOptions &
    ChildrenControlConfig;
