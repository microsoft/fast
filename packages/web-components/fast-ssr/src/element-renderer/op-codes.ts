/**
 * Allows fast identification of operation types
 */
export enum OpType {
    text,
    customElementClose,
}

/**
 * Operation to emit static text
 */
export type TextOp = {
    type: OpType.text;
    value: string;
};

/**
 * Operation to close a custom element
 */
export type CustomElementCloseOp = {
    type: OpType.customElementClose;
};

export type Op = TextOp | CustomElementCloseOp;
