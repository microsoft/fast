/**
 * These elements are self closing because they cannot have content
 */
export const voidElements: string[] = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];

export const enum Delimiter {
    startTagOpen = "<",
    startTagClose = ">",
    startTagSelfClose = "/>",
    endTagOpen = "</",
    endTagClose = ">",
    assign = "=",
}
