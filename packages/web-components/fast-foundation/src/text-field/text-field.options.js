/**
 * Text field sub-types
 * @public
 */
export var TextFieldType;
(function (TextFieldType) {
    /**
     * An email TextField
     */
    TextFieldType["email"] = "email";
    /**
     * A password TextField
     */
    TextFieldType["password"] = "password";
    /**
     * A telephone TextField
     */
    TextFieldType["tel"] = "tel";
    /**
     * A text TextField
     */
    TextFieldType["text"] = "text";
    /**
     * A URL TextField
     */
    TextFieldType["url"] = "url";
})(TextFieldType || (TextFieldType = {}));
