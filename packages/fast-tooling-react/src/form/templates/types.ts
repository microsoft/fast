export enum ControlType {
    select = "select",
    array = "array",
    linkedData = "linkedData",
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

export enum LinkedDataActionType {
    add = "add",
    remove = "remove",
    reorder = "reorder",
}

export interface OnChangeConfig extends ControlOnChangeConfig {
    /**
     * The lodash path location of the data
     */
    dataLocation: string;

    /**
     * The dictionaryId of the data
     */
    dictionaryId: string;
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
     * Whether this data is a new linked data item
     */
    isLinkedData?: boolean;

    /**
     *
     */
    linkedDataAction?: LinkedDataActionType;

    /**
     * The index if this data is an array
     */
    index?: number;
}
