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
