import {
    FormOrderByPropertyNamesCategories,
    FormOrderByPropertyNamesProperties,
    FormOrderByPropertyNamesProps,
} from "./form.props";
import { OnChangeConfig, StandardControlPlugin, UpdateSectionConfig } from "./templates";
import { ErrorObject } from "ajv";
import { SingleLineControlPlugin } from "./templates/plugin.control.single-line";

/**
 * Section class name contract
 */
export interface FormSectionClassNameContract {
    formSection: string;
    formSection_invalidMessage: string;
}

export enum oneOfAnyOfType {
    anyOf = "anyOf",
    oneOf = "oneOf",
}

export interface InitialOneOfAnyOfState {
    /**
     * The current schema
     */
    schema: any;

    /**
     * Whether there is a oneOf/anyOf at the root level
     */
    oneOfAnyOf?: OneOfAnyOf;
}

export interface OneOfAnyOf {
    /**
     * The type (oneOf/anyOf)
     */
    type: oneOfAnyOfType;

    /**
     * The active index
     */
    activeIndex: number;
}

export type AddExampleData = (
    propertyLocation: string,
    additionalSchemaPathSyntax?: string
) => void;

/* tslint:disable-next-line */
export interface FormSectionState extends InitialOneOfAnyOfState {}

export interface Controls {
    /**
     * The button control
     */
    button: StandardControlPlugin;

    /**
     * The array control
     */
    array: StandardControlPlugin;

    /**
     * The checkbox control
     */
    checkbox: SingleLineControlPlugin;

    /**
     * The children control
     */
    children: StandardControlPlugin;

    /**
     * The display control
     */
    display: StandardControlPlugin;

    /**
     * The textarea control
     */
    textarea: StandardControlPlugin;

    /**
     * The select control
     */
    select: StandardControlPlugin;

    /**
     * The section link control
     */
    sectionLink: StandardControlPlugin;

    /**
     * The number field control
     */
    numberField: StandardControlPlugin;
}

export interface FormSectionProps {
    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * Control plugins
     */
    controls: Controls;

    /**
     * The custom control plugins which will be used
     * instead of the default control plugins
     */
    controlPlugins?: StandardControlPlugin[];

    /**
     * The default values
     */
    default: any;

    /**
     * The location in the schema
     */
    schemaLocation: string;

    /**
     * The data to map to the form section
     */
    data: any;

    /**
     * The optional components to be added as children
     */
    childOptions: any[];

    /**
     * The schema to create the section form items
     */
    schema: any;

    /**
     * The onChange event to trigger a data update
     */
    onChange: (config: OnChangeConfig) => void;

    /**
     * The update event to trigger a new active section and/or component
     */
    onUpdateSection: (config: UpdateSectionConfig) => void;

    /**
     * The string to be used if a prop is untitled
     */
    untitled: string;

    /**
     * The configuration for ordering properties by their names
     */
    orderByPropertyNames?: FormOrderByPropertyNamesProps;

    /**
     * The validation errors
     */
    validationErrors: ErrorObject[] | void;

    /**
     * Display the validation inline
     */
    displayValidationInline?: boolean;

    /**
     * Display the validation as browser default tooltips
     */
    displayValidationBrowserDefault?: boolean;
}

export interface FormCategoryItems {
    /**
     * The items weight
     */
    weight: number;

    /**
     * The parameters to pass to generate the form item
     */
    params: FormControlParameters;
}

export interface FormCategoryProps {
    /**
     * The category weight
     */
    weight: number;

    /**
     * The category form items
     */
    items: FormCategoryItems[];

    /**
     * The category title
     */
    title: string;

    /**
     * Allows category to be expandable
     */
    expandable?: boolean;
}

export interface FormControlParameters {
    /**
     * The schema property
     */
    schema: any;

    /**
     * The index
     */
    index: number;

    /**
     * The location of the data via lodash path syntax
     */
    dataLocation: string;

    /**
     * The location of the schema via lodash path syntax
     */
    schemaLocation: string;

    /**
     * The property name
     */
    propertyName: string;

    /**
     * The required status of this property
     */
    isRequired: boolean;

    /**
     * The title, to be used as a label or as a breadcrumb
     */
    title: string;
}

export interface AssignedCategoryParams {
    /**
     * The category name
     */
    category: string;

    /**
     * The category weight, acts the same as z-index,
     * the larger the weight, the higher it is displayed
     */
    categoryWeight: number;

    /**
     * The item weight, similar to category weight will
     * display higher the larger the weight is
     */
    itemWeight: number;

    /**
     * Allows category to be expandable
     */
    expandable?: boolean;
}

export interface FormControlsWithConfigOptions {
    /**
     * Parameters such as weight, attribute assignment etc
     */
    parameters: FormControlParameters[];

    /**
     * Form items which conform to a section
     */
    items: React.ReactNode[];
}

export interface OptionalToggleConfig {
    schema: any;
    onChange: (propertyLocation: string, value: any) => void;
    dataLocation: string;
    data: any;
    dataCache: any;
}

export interface SchemaSubsectionConfig {
    oneOfAnyOf: any;
    objectProperty: string;
    dataLocation: string;
    schemaLocation: string;
    state: any;
    props: any;
}

export interface AssignedParamsByCategoryConfig {
    categoryProperties: string[];
    formControlParameter: FormControlParameters;
    category: FormOrderByPropertyNamesCategories;
    categoryProperty: FormOrderByPropertyNamesProperties;
    assignedItemWeight: number;
}
