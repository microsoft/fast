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
    noneBindingModifier: string;
}

/**
 * Default syntax for FAST declarative templates
 */
export const {
    attributeDirectivePrefix,
    clientSideCloseExpression,
    clientSideOpenExpression,
    closeExpression,
    executionContextAccessor,
    noneBindingModifier,
    openExpression,
    repeatDirectiveClose,
    repeatDirectiveOpen,
    unescapedCloseExpression,
    unescapedOpenExpression,
    whenDirectiveClose,
    whenDirectiveOpen,
}: Syntax = {
    attributeDirectivePrefix: "f-",
    clientSideCloseExpression: "}",
    clientSideOpenExpression: "{",
    closeExpression: "}}",
    executionContextAccessor: "$c",
    noneBindingModifier: "|binding:none",
    openExpression: "{{",
    unescapedCloseExpression: "}}}",
    unescapedOpenExpression: "{{{",
    repeatDirectiveClose: "</f-repeat>",
    repeatDirectiveOpen: "<f-repeat",
    whenDirectiveClose: "</f-when>",
    whenDirectiveOpen: "<f-when",
};
