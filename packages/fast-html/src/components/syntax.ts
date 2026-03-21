interface Syntax {
    clientSideOpenExpression: string;
    clientSideCloseExpression: string;
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

export const {
    attributeDirectivePrefix,
    clientSideCloseExpression,
    clientSideOpenExpression,
    closeExpression,
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
    openExpression: "{{",
    unescapedCloseExpression: "}}}",
    unescapedOpenExpression: "{{{",
    repeatDirectiveClose: "</f-repeat>",
    repeatDirectiveOpen: "<f-repeat",
    whenDirectiveClose: "</f-when>",
    whenDirectiveOpen: "<f-when",
};
