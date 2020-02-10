export enum ControlType {
    select = "select",
    array = "array",
    children = "children",
    checkbox = "checkbox",
    numberField = "numberField",
    section = "section",
    sectionLink = "sectionLink",
    display = "display",
    button = "button",
    textarea = "textarea",
}

/**
 * This is the context in which the control exists,
 * "default" places the control inset to align with
 * actions that appear on the right, "fill" stretches
 * the control to be the full width of the available space
 */
export enum ControlContext {
    default = "default",
    fill = "fill",
}

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
