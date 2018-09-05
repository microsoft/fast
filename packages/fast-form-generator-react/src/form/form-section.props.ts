import {
    DataOnChange,
    IFormAttributeSettingsMappingToPropertyNames,
    IFormComponentMappingToPropertyNamesProps,
    IFormLocation,
    IFormOrderByPropertyNamesCategories,
    IFormOrderByPropertyNamesProperties,
    IFormOrderByPropertyNamesProps
} from "./form.props";

export enum oneOfAnyOfType {
    anyOf = "anyOf",
    oneOf = "oneOf"
}

export interface IOneOfAnyOf {
    /**
     * The type (oneOf/anyOf)
     */
    type: oneOfAnyOfType;

    /**
     * The active index
     */
    activeIndex: number;
}

export type updateActiveSection = (
    schemaLocation: string,
    dataLocation: string,
    schema?: any
) => void;

export interface IFormSectionState {
    /**
     * The current schema
     */
    schema: any;

    /**
     * Whether there is a oneOf/anyOf at the root level
     */
    oneOfAnyOf?: IOneOfAnyOf;

    /**
     * The potential sections inside this schema
     */
    sections: IFormSectionProps[];
}

export interface IFormSectionProps {
    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * The location in the schema
     */
    schemaLocation: string;

    /**
     * The data to map to the form section
     */
    data: any;

    /**
     * The cached data
     */
    dataCache: any;

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
    onChange: DataOnChange;

    /**
     * The update event to trigger a new active section and/or component
     */
    onUpdateActiveSection: updateActiveSection;

    /**
     * The string to be used if a prop is untitled
     */
    untitled: string;

    /**
     * The custom passed location of a subsection to initially activate
     */
    location?: IFormLocation;

    /**
     * The configuration to map property names to custom controls
     */
    componentMappingToPropertyNames?: IFormComponentMappingToPropertyNamesProps;

    /**
     * The configuration for mapping attributes to form items
     */
    attributeSettingsMappingToPropertyNames?: IFormAttributeSettingsMappingToPropertyNames;

    /**
     * The configuration for ordering properties by their names
     */
    orderByPropertyNames?: IFormOrderByPropertyNamesProps;
}

export interface IFormCategoriesItems {
    /**
     * The items weight
     */
    weight: number;

    /**
     * The parameters to pass to generate the form item
     */
    params: IFormItemParameters;
}

export interface IFormCategories {
    /**
     * The category weight
     */
    weight: number;

    /**
     * The category form items
     */
    items: IFormCategoriesItems[];

    /**
     * The category title
     */
    title: string;

    /**
     * Allows category to be expandable
     */
    expandable?: boolean;
}

export interface IFormItemParameters {
    /**
     * The schema property
     */
    property: any;

    /**
     * The index
     */
    index: number;

    /**
     * The property name
     */
    item: string;

    /**
     * The required status of this property
     */
    isRequired: boolean;

    /**
     * The title, to be used as a label or as a breadcrumb
     */
    title: string;
}

export interface IAssignedCategoryParams {
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

export interface IFormItemsWithConfigOptions {
    /**
     * Parameters such as weight, attribute assignment etc
     */
    parameters: IFormItemParameters[];

    /**
     * Form items which conform to a section
     */
    items: JSX.Element[];
}

export interface IOptionalToggleConfig {
    schema: any;
    onChange: (propertyLocation: string, value: any) => void;
    dataLocation: string;
    data: any;
    dataCache: any;
}

export interface ISchemaSubsectionConfig {
    oneOfAnyOf: any;
    objectProperty: string;
    dataLocation: string;
    schemaLocation: string;
    state: any;
    props: any;
}

export interface IAssignedParamsByCategoryConfig {
    categoryProperties: string[];
    formItemParameter: IFormItemParameters;
    category: IFormOrderByPropertyNamesCategories;
    categoryProperty: IFormOrderByPropertyNamesProperties;
    assignedItemWeight: number;
}
