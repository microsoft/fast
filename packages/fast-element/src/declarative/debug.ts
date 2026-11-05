export const debugMessages = {
    [2000 /* noTemplateProvided */]:
        "The <f-template> must contain a direct <template> child; this is missing from ${name}.",
    [2001 /* moreThanOneTemplateProvided */]:
        "There can only be one <template> inside the <f-template>; remove any extra <template> elements and keep exactly one for ${name}.",
    [2002 /* moreThanOneHostProvided */]:
        "There can only be one direct <f-host> inside the <f-template>; remove extra <f-host> declarations from ${name}.",
};
