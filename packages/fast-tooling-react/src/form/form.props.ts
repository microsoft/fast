import { SingleLineControlPlugin, StandardControlPlugin } from "./templates";
import { ControlContext } from "./templates/types";
import {
    DataDictionary,
    MessageSystem,
    NavigationConfig,
    NavigationConfigDictionary,
    Validation,
} from "@microsoft/fast-tooling";

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
}

export interface ControlPluginConfig {
    plugin: typeof StandardControlPlugin | typeof SingleLineControlPlugin;
    component: React.ComponentClass;
    context: ControlContext;
}
