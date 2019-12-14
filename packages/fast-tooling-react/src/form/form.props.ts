import Navigation, { NavigationItem } from "./utilities/navigation";
import { ErrorObject } from "ajv";
import { SingleLineControlPlugin, StandardControlPlugin } from "./templates";
import { ControlContext } from "./templates/types";
import { FormChildOptionItem } from "./types";

/**
 * Form class name contract
 */
export interface FormClassNameContract {
    form?: string;
    form_breadcrumbs: string;
}

export type PropsOnChange = (data: any) => void;

export type LocationOnChange = (dataLocation: string) => void;

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
     * The data to use for validation instead of the data
     * Do not use this unless you know
     * what you're doing, this prop could be removed at any time.
     */
    _UNSAFE_validationData?: any;

    /**
     * The onChange event for updating the data
     */
    onChange: PropsOnChange;

    /**
     * The optional components to be added as children
     * @deprecated
     */
    childOptions?: FormChildOptionItem[];

    /**
     * The custom passed location of a subsection to initially activate
     */
    location?: FormLocation;

    /**
     * Display the validation inline
     */
    displayValidationInline?: boolean;

    /**
     * Display the validation as browser default tooltips
     */
    displayValidationBrowserDefault?: boolean;

    /**
     * The custom control plugins which will be used
     * instead of the default control plugins
     */
    controlPlugins?: StandardControlPlugin[];
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
     * Current active data location
     */
    activeDataLocation: string;

    /**
     * The Navigation class instance
     */
    navigationInstance: Navigation;

    /**
     * The schema, used to check if the schema has been updated
     */
    schema: any;

    /**
     * The navigation items used for the breadcrumb links
     */
    navigation?: NavigationItem[];

    /**
     * The location, which can be the root or a sub location,
     * which corresponds to a different section
     */
    location?: FormLocation;

    /**
     * The validation errors if there are any
     */
    validationErrors: ErrorObject[] | void;
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

export interface ControlPluginConfig {
    plugin: typeof StandardControlPlugin | typeof SingleLineControlPlugin;
    component: React.ComponentClass;
    context: ControlContext;
}
