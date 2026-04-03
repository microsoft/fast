/**
 * Syntax for FAST declarative templates
 */
interface Syntax {
    clientSideOpenExpression: string;
    clientSideCloseExpression: string;
    executionContextAccessor: string;
    openExpression: string;
    closeExpression: string;
    unescapedOpenExpression: string;
    unescapedCloseExpression: string;
    repeatDirectiveOpen: string;
    repeatDirectiveClose: string;
    whenDirectiveOpen: string;
    whenDirectiveClose: string;
    attributeDirectivePrefix: string;
    bindingArgSeparator: string;
    bindingArgKeyValueSeparator: string;
    bindingKey: string;
    noneBinding: string;
}

/**
 * Default syntax for FAST declarative templates
 */
export const {
    attributeDirectivePrefix,
    bindingArgKeyValueSeparator,
    bindingArgSeparator,
    bindingKey,
    clientSideCloseExpression,
    clientSideOpenExpression,
    closeExpression,
    executionContextAccessor,
    noneBinding,
    openExpression,
    repeatDirectiveClose,
    repeatDirectiveOpen,
    unescapedCloseExpression,
    unescapedOpenExpression,
    whenDirectiveClose,
    whenDirectiveOpen,
}: Syntax = {
    attributeDirectivePrefix: "f-",
    bindingArgKeyValueSeparator: ":",
    bindingArgSeparator: "|",
    bindingKey: "binding",
    clientSideCloseExpression: "}",
    clientSideOpenExpression: "{",
    closeExpression: "}}",
    executionContextAccessor: "$c",
    noneBinding: "none",
    openExpression: "{{",
    unescapedCloseExpression: "}}}",
    unescapedOpenExpression: "{{{",
    repeatDirectiveClose: "</f-repeat>",
    repeatDirectiveOpen: "<f-repeat",
    whenDirectiveClose: "</f-when>",
    whenDirectiveOpen: "<f-when",
};
