/**
 * Operation to output static text
 */
export type TextOp = {
    type: "text";
    value: string;
};

export type Op = TextOp;
