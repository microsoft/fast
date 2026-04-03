/**
 * Syntax for FAST declarative templates
 */
interface Syntax {
    clientSideOpenExpression: string;
    clientSideCloseExpression: string;
    executionContextAccessor: string;
    eventArgAccessor: string;
    deprecatedEventArgAccessor: string;
    openExpression: string;
    closeExpression: string;
    unescapedOpenExpression: string;
    unescapedCloseExpression: string;
    repeatDirectiveOpen: string;
    repeatDirectiveClose: string;
    whenDirectiveOpen: string;
    whenDirectiveClose: string;
    attributeDirectivePrefix: string;
}

/**
 * Default syntax for FAST declarative templates
 */
export const {
    attributeDirectivePrefix,
    clientSideCloseExpression,
    clientSideOpenExpression,
    closeExpression,
    deprecatedEventArgAccessor,
    eventArgAccessor,
    executionContextAccessor,
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
    deprecatedEventArgAccessor: "e",
    eventArgAccessor: "$e",
    executionContextAccessor: "$c",
    openExpression: "{{",
    unescapedCloseExpression: "}}}",
    unescapedOpenExpression: "{{{",
    repeatDirectiveClose: "</f-repeat>",
    repeatDirectiveOpen: "<f-repeat",
    whenDirectiveClose: "</f-when>",
    whenDirectiveOpen: "<f-when",
};
