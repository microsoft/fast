import { AspectedHTMLDirective } from "@microsoft/fast-element";

/**
 * Allows fast identification of operation types
 */
export enum OpType {
    text,
    customElementClose,
    directive,
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

/**
 * Operation to emit static text
 */
export type DirectiveOp = {
    type: OpType.directive;
    directive: AspectedHTMLDirective;
};

export type Op = TextOp | CustomElementCloseOp | DirectiveOp;
