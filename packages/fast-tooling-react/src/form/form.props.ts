import { ErrorObject } from "ajv";
import { SingleLineControlPlugin, StandardControlPlugin } from "./templates";
import { ControlContext } from "./templates/types";
import { TreeNavigationConfig } from "../message-system/navigation.props";
import { MessageSystemRegistry } from "../message-system-registry";

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
     * used for sending data to the message system
     */
    messageSystem: void | Worker;

    /**
     * The message system registry
     * used to register information about this component to the message system
     */
    messageSystemRegistry: MessageSystemRegistry;

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
     * Current active navigation ID
     */
    activeNavigationId: string;

    /**
     * The schema
     */
    schema: any;

    /**
     * The data
     */
    data: any;

    /**
     * The navigation
     */
    navigation: TreeNavigationConfig;

    /**
     * The validation errors if there are any
     */
    validationErrors: ErrorObject[] | void;
}

export interface ControlPluginConfig {
    plugin: typeof StandardControlPlugin | typeof SingleLineControlPlugin;
    component: React.ComponentClass;
    context: ControlContext;
}
