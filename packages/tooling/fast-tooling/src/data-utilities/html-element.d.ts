/**
 * These elements are self closing because they cannot have content
 */
export declare const voidElements: string[];
export declare const enum Delimiter {
    startTagOpen = "<",
    startTagClose = ">",
    startTagSelfClose = "/>",
    endTagOpen = "</",
    endTagClose = ">",
    assign = "=",
}
