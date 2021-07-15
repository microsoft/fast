/**
 * Note on nomenclature: incoming messages are being sent to, and recieved, by the message system
 * while outgoing messages are being sent from the message system to any registered service. These
 * terms are from the POV of the message system.
 */
export var MessageSystemDataDictionaryTypeAction;
(function (MessageSystemDataDictionaryTypeAction) {
    MessageSystemDataDictionaryTypeAction["get"] = "get";
    MessageSystemDataDictionaryTypeAction["updateActiveId"] = "update-active-id";
})(MessageSystemDataDictionaryTypeAction || (MessageSystemDataDictionaryTypeAction = {}));
export var MessageSystemDataTypeAction;
(function (MessageSystemDataTypeAction) {
    MessageSystemDataTypeAction["update"] = "update";
    MessageSystemDataTypeAction["remove"] = "remove";
    MessageSystemDataTypeAction["add"] = "add";
    MessageSystemDataTypeAction["duplicate"] = "duplicate";
    MessageSystemDataTypeAction["removeLinkedData"] = "remove-linked-data";
    MessageSystemDataTypeAction["addLinkedData"] = "add-linked-data";
    MessageSystemDataTypeAction["reorderLinkedData"] = "reorder-linked-data";
})(MessageSystemDataTypeAction || (MessageSystemDataTypeAction = {}));
export var MessageSystemNavigationDictionaryTypeAction;
(function (MessageSystemNavigationDictionaryTypeAction) {
    MessageSystemNavigationDictionaryTypeAction["get"] = "get";
    MessageSystemNavigationDictionaryTypeAction["updateActiveId"] = "update-active-id";
})(
    MessageSystemNavigationDictionaryTypeAction ||
        (MessageSystemNavigationDictionaryTypeAction = {})
);
export var MessageSystemNavigationTypeAction;
(function (MessageSystemNavigationTypeAction) {
    MessageSystemNavigationTypeAction["update"] = "update";
    MessageSystemNavigationTypeAction["get"] = "get";
})(MessageSystemNavigationTypeAction || (MessageSystemNavigationTypeAction = {}));
export var MessageSystemValidationTypeAction;
(function (MessageSystemValidationTypeAction) {
    MessageSystemValidationTypeAction["update"] = "update";
    MessageSystemValidationTypeAction["get"] = "get";
})(MessageSystemValidationTypeAction || (MessageSystemValidationTypeAction = {}));
export var MessageSystemHistoryTypeAction;
(function (MessageSystemHistoryTypeAction) {
    MessageSystemHistoryTypeAction["get"] = "get";
})(MessageSystemHistoryTypeAction || (MessageSystemHistoryTypeAction = {}));
export var MessageSystemSchemaDictionaryTypeAction;
(function (MessageSystemSchemaDictionaryTypeAction) {
    MessageSystemSchemaDictionaryTypeAction["add"] = "add";
})(
    MessageSystemSchemaDictionaryTypeAction ||
        (MessageSystemSchemaDictionaryTypeAction = {})
);
