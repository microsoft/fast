import {
    DataDictionary,
    MessageSystem,
    NavigationConfig,
    NavigationConfigDictionary,
    Validation,
} from "@microsoft/fast-tooling";
import { SingleLineControlPlugin, StandardControlPlugin } from "./templates";
import { ControlContext } from "./templates/types";

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

export interface FormCategory {
    /**
     * The data locations using lodash dot and
     * bracket notation to indicate which properties
     * belong to this category
     */
    dataLocations: string[];

    /**
     * The title of this category
     */
    title: string;
}

export interface FormSectionCategory {
    /**
     * A set of form categories corresponding
     * to the current data location used as a string
     */
    [key: string]: Array<FormCategory>;
}

export interface FormCategoryDictionary {
    /**
     * A dictionary of form categories
     * where the key is the schema $id
     */
    [key: string]: FormSectionCategory;
}

/**
 * The schema form props
 */
export interface FormProps {
    /**
     * The message system
     * used for sending and receiving data to the message system
     */
    messageSystem: MessageSystem;

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
    controls?: StandardControlPlugin[];

    /**
     * Localized strings for the default controls. Default is English.
     */
    strings?: FormStrings;

    /**
     * Category configurations
     */
    categories?: FormCategoryDictionary;
}

/**
 * The schema form state
 */
export interface FormState {
    /**
     * Current active dictionary ID
     */
    activeDictionaryId: string;

    /**
     * Current active navigation config ID
     */
    activeNavigationConfigId: string;

    /**
     * The schema
     */
    schema: any;

    /**
     * The dictionary of schemas
     */
    schemaDictionary: { [key: string]: any };

    /**
     * The data
     */
    data: any;

    /**
     * The dictionary of data items
     */
    dataDictionary: DataDictionary<any>;

    /**
     * The navigation
     */
    navigation: NavigationConfig;

    /**
     * The navigation dictionary
     */
    navigationDictionary: NavigationConfigDictionary;

    /**
     * The validation errors if there are any
     */
    validationErrors: Validation;

    /**
     * The options sent from the last message system message
     */
    options: any | null;
}

export interface ControlPluginConfig {
    plugin: typeof StandardControlPlugin | typeof SingleLineControlPlugin;
    component: React.ComponentClass;
    context: ControlContext;
}

export interface FormStrings {
    arrayAddItemTip: string;
    arrayAddItemLabel: string;
    linkedDataPlaceholder: string;
    sectionLinkEditLabel: string;
    sectionSelectDefault: string;
    sectionSelectLabel: string;
    sectionAdditionalPropExample: string;
    sectionAdditionalPropLabel: string;
    fileUploadPreviewAlt: string;
    fileUploadUploading: string;
    fileUploadDragInstr: string;
    fileUploadBrowseFiles: string;
    textAlignLeftLabel: string;
    textAlignCenterLabel: string;
    textAlignRightLabel: string;
    textAlignJustifyLabel: string;
    themeLightLabel: string;
    themeDarkLabel: string;
    constValueLabel: string;
    defaultValueLabel: string;
    dragItemRemoveItem: string;
}
