export const debugMessages = {
    [2000 /* noTemplateProvided */]:
        "The first child of the <f-template> must be a <template>, this is missing from ${name}.",
    [2001 /* moreThanOneTemplateProvided */]:
        "There can only be one <template> inside the <f-template>; remove any extra <template> elements and keep exactly one for ${name}.",
    [2002 /* moreThanOneMatchingTemplateProvided */]:
        'There can only be one connected <f-template name="${name}"> in a registry while resolving a declarative template; remove duplicate matches for ${name}.',
    [2003 /* invalidTemplateString */]:
        "Declarative template strings for ${name} must contain exactly one <f-template> element.",
    [2004 /* templateStringResolverNotCalled */]:
        "The declarative template callback for ${name} completed without calling templateStringResolver(). Return or await templateStringResolver(...) with an <f-template> string.",
};
