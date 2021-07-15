export var MessageTypes;
(function (MessageTypes) {
    MessageTypes["recipe"] = "recipe";
    MessageTypes["designSystem"] = "designSystem";
    MessageTypes["reset"] = "reset";
    MessageTypes["sync"] = "sync";
})(MessageTypes || (MessageTypes = {}));
/**
 * The type of action that a recipe message should perform.
 */
export var MessageAction;
(function (MessageAction) {
    MessageAction["assign"] = "assign";
    MessageAction["delete"] = "delete";
})(MessageAction || (MessageAction = {}));
