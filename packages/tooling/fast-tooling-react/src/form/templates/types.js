export var ControlType;
(function (ControlType) {
    ControlType["select"] = "select";
    ControlType["array"] = "array";
    ControlType["linkedData"] = "linkedData";
    ControlType["checkbox"] = "checkbox";
    ControlType["numberField"] = "numberField";
    ControlType["section"] = "section";
    ControlType["sectionLink"] = "sectionLink";
    ControlType["display"] = "display";
    ControlType["button"] = "button";
    ControlType["textarea"] = "textarea";
})(ControlType || (ControlType = {}));
/**
 * This is the context in which the control exists,
 * "default" places the control inset to align with
 * actions that appear on the right, "fill" stretches
 * the control to be the full width of the available space
 */
export var ControlContext;
(function (ControlContext) {
    ControlContext["default"] = "default";
    ControlContext["fill"] = "fill";
})(ControlContext || (ControlContext = {}));
export var BadgeType;
(function (BadgeType) {
    BadgeType["warning"] = "warning";
    BadgeType["info"] = "info";
    BadgeType["locked"] = "locked";
})(BadgeType || (BadgeType = {}));
export var ArrayAction;
(function (ArrayAction) {
    ArrayAction["add"] = "add";
    ArrayAction["remove"] = "remove";
})(ArrayAction || (ArrayAction = {}));
export var LinkedDataActionType;
(function (LinkedDataActionType) {
    LinkedDataActionType["add"] = "add";
    LinkedDataActionType["remove"] = "remove";
    LinkedDataActionType["reorder"] = "reorder";
})(LinkedDataActionType || (LinkedDataActionType = {}));
