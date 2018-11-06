import { updateActiveSection } from "./form-section.props";
import { NavigationItem } from "./form.utilities";
import { ChildOptionItem } from "@microsoft/fast-data-utilities-react";

export type PropsOnChange = (data: any) => void;

export type DataOnChange = (
    location: string,
    data: any,
    isArray?: boolean,
    index?: number,
    isChildren?: boolean
) => void;

export type LocationOnChange = (schemaLocation: string, dataLocation: string) => void;

export type BreadcrumbItemEventHandler = (e: React.MouseEvent<HTMLAnchorElement>) => void;

export type FormTag = "form" | "div";

/**
 * The schema form props
 */
export interface FormProps {
    /**
     * The optional class name
     */
    className?: string;

    /**
     * The schema to base the form on
     */
    schema: any;

    /**
     * The data to map to the form
     */
    data: any;

    /**
     * The onChange event for updating the data
     */
    onChange: PropsOnChange;

    /**
     * The optional components to be added as children
     */
    childOptions?: ChildOptionItem[];

    /**
     * The custom passed location of a subsection to initially activate
     */
    location?: FormLocation;

    /**
     * The configuration for mapping form items to layout controls
     */
    componentMappingToPropertyNames?: FormComponentMappingToPropertyNamesProps;

    /**
     * The configuration for mapping attributes to form items
     */
    attributeSettingsMappingToPropertyNames?: FormAttributeSettingsMappingToPropertyNames;

    /**
     * The configuration for ordering properties by their names
     */
    orderByPropertyNames?: FormOrderByPropertyNamesProps;
}

/**
 * The schema form state
 */
export interface FormState {
    /**
     * The current title
     */
    titleProps: string;

    /**
     * The current schema being edited
     */
    schema: any;

    /**
     * Current active schema location
     */
    activeSchemaLocation: string;

    /**
     * Current active data location
     */
    activeDataLocation: string;

    /**
     * The cached data
     */
    dataCache: any;

    /**
     * The navigation items used for the breadcrumb links
     */
    navigation?: NavigationItem[];

    /**
     * The location, which can be the root or a sub location,
     * which corresponds to a different section
     */
    location?: any;
}

export interface FormLocation {
    /**
     * The data location
     */
    dataLocation: string;

    /**
     * The schema location
     */
    schemaLocation: string;

    /**
     * The location change callback
     */
    onChange: LocationOnChange;
}

export interface AttributeSettingsCommon {
    /**
     * The list of property names to change the attribute
     */
    propertyNames: string[];
}

export interface TextareaAttributeRows extends AttributeSettingsCommon {
    /**
     * The value to set the attribute to
     */
    value: number;
}

export interface TextareaAttributeSettingsMappingToPropertyNames {
    /**
     * The rows attribute
     */
    rows: TextareaAttributeRows[];
}

/**
 * The configuration for the mapping of attribute settings to property names
 */
export interface FormAttributeSettingsMappingToPropertyNames {
    /**
     * The textarea component
     */
    textarea: TextareaAttributeSettingsMappingToPropertyNames;
}

export type AttributeSettingsMappingToPropertyNames = TextareaAttributeSettingsMappingToPropertyNames;

/**
 * The configuration for the mapping property names to form controls
 */
export interface FormComponentMappingToPropertyNamesProps {
    /**
     * A custom color that maps to a CSS color value using a color picker
     * Maps to string values - Text field
     */
    customColor?: string[];

    /**
     * A swatch picker that makes to CSS color values provided
     * Maps to string enum values - Select
     */
    swatch?: string[];

    /**
     * An alignment choosing from a combination of "top", "center", "bottom"
     * Maps to string enum values - Select
     */
    alignVertical?: string[];

    /**
     * An alignment choosing from a combination of "left", "center", "right"
     * Maps to string enum values - Select
     */
    alignHorizontal?: string[];

    /**
     * A file upload for facilitating images etc
     * Maps to string values - Text field
     */
    fileUpload?: string[];

    /**
     * A theme selector, accepts "light" or "dark"
     */
    theme?: string[];

    /**
     * A glyph selector, accepts an array of possible glyphs
     */
    glyphPicker?: string[];
}

/**
 * The property order properties within a category
 */
export interface FormOrderByPropertyNamesProperties {
    /**
     * Name of the property
     */
    propertyName: string | string[];

    /**
     * Weight of the property for ordering
     */
    weight: number;
}

/**
 * The property order categories
 */
export interface FormOrderByPropertyNamesCategories {
    /**
     * The category title
     */
    title: string;

    /**
     * The weight given to the category
     */
    weight: number;

    /**
     * The properties belonging to the category
     */
    properties: FormOrderByPropertyNamesProperties[];

    /**
     * Allows category to be expandable
     */
    expandable?: boolean;
}

/**
 * The configuration for the weights of properties as the appear in order
 */
export interface FormOrderByPropertyNamesProps {
    /**
     * Shows the categories when there are more than this number
     */
    showCategoriesAtPropertyCount: number;

    /**
     * The weight to give the property names not listed in any category
     */
    defaultCategoryWeight: number;

    /**
     * The categories to drop properties into
     */
    categories: FormOrderByPropertyNamesCategories[];
}
