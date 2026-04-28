/**
 * Syntax for FAST declarative templates
 */
interface Syntax {
    clientSideOpenExpression: string;
    clientSideCloseExpression: string;
    executionContextAccessor: string;
    eventArgAccessor: string;
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

const defaultSyntax: Syntax = {
    attributeDirectivePrefix: "f-",
    clientSideCloseExpression: "}",
    clientSideOpenExpression: "{",
    closeExpression: "}}",
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

export const attributeDirectivePrefix = defaultSyntax.attributeDirectivePrefix;
export const clientSideCloseExpression = defaultSyntax.clientSideCloseExpression;
export const clientSideOpenExpression = defaultSyntax.clientSideOpenExpression;
export const closeExpression = defaultSyntax.closeExpression;

/**
 * Event argument accessor for declarative event bindings.
 * @public
 */
export const eventArgAccessor = defaultSyntax.eventArgAccessor;

/**
 * Execution context accessor for declarative event bindings.
 * @public
 */
export const executionContextAccessor = defaultSyntax.executionContextAccessor;

export const openExpression = defaultSyntax.openExpression;
export const repeatDirectiveClose = defaultSyntax.repeatDirectiveClose;
export const repeatDirectiveOpen = defaultSyntax.repeatDirectiveOpen;
export const unescapedCloseExpression = defaultSyntax.unescapedCloseExpression;
export const unescapedOpenExpression = defaultSyntax.unescapedOpenExpression;
export const whenDirectiveClose = defaultSyntax.whenDirectiveClose;
export const whenDirectiveOpen = defaultSyntax.whenDirectiveOpen;
