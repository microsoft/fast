import { NavigationItem } from "../utilities";
import { FormPlugin, FormPluginProps } from "../plugin";

/**
 * Form class name contract
 */
export interface FormClassNameContract {
    form?: string;
    form_breadcrumbs: string;
}

export type PropsOnChange = (data: any) => void;

export type SchemaOnChange = (schema: any) => void;

export type DataOnChange = (
    location: string,
    data: any,
    isArray?: boolean,
    index?: number,
    isChildren?: boolean
) => void;

export type LocationOnChange = (dataLocation: string) => void;

export type BreadcrumbItemEventHandler = (e: React.MouseEvent<HTMLAnchorElement>) => void;

export type FormTag = "form" | "div";

export interface FormChildOptionItem {
    /**
     * The name of the component
     */
    name?: string;

    /**
     * The React component
     */
    component: React.ComponentType;

    /**
     * The JSON schema for the component
     */
    schema: any;

    /**
     * The plugins for data assigned to this component
     * TODO: enable this for #1445
     */
    // plugins?: Array<FormPlugin<FormPluginProps>>;
}

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
     * The plugins to update the schema
     */
    plugins?: Array<FormPlugin<FormPluginProps>>;

    /**
     * The change event for updating the schema
     */
    onSchemaChange?: SchemaOnChange;

    /**
     * The optional components to be added as children
     */
    childOptions?: FormChildOptionItem[];

    /**
     * The custom passed location of a subsection to initially activate
     */
    location?: FormLocation;
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
    location?: FormLocation;
}

export interface FormLocation {
    /**
     * The data location
     */
    dataLocation: string;

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
