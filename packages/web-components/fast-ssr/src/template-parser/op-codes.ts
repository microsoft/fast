import { InlinableHTMLDirective } from "@microsoft/fast-element";
import { AttributeType } from "./attributes.js";

/**
 * Allows fast identification of operation types
 */
export enum OpType {
    customElementOpen,
    customElementClose,
    customElementAttributes,
    customElementShadow,
    attributeBinding,
    directive,
    templateElementOpen,
    templateElementClose,
    text,
}

/**
 * Operation to emit static text
 */
export type TextOp = {
    type: OpType.text;
    value: string;
};

/**
 * Operation to open a custom element
 */
export type CustomElementOpenOp = {
    type: OpType.customElementOpen;
    /**
     * The tagname of the custom element
     */
    tagName: string;

    /**
     * The constructor of the custom element
     */
    ctor: typeof HTMLElement;

    /**
     * Attributes of the custom element, non-inclusive of any attributes
     * that are the product of bindings
     */
    staticAttributes: Map<string, string>;
};

/**
 * Operation to close a custom element
 */
export type CustomElementCloseOp = {
    type: OpType.customElementClose;
};

export type CustomElementShadowOp = {
    type: OpType.customElementShadow;
};

/**
 * Operation to emit static text
 */
export type DirectiveOp = {
    type: OpType.directive;
    directive: InlinableHTMLDirective;
};

/**
 * Operation to emit a bound attribute
 */
export type AttributeBindingOp = {
    type: OpType.attributeBinding;
    directive: InlinableHTMLDirective;
    name: string;
    attributeType: AttributeType;
    useCustomElementInstance: boolean;
};

/**
 * Operation to emit a template element open tag
 */
export type TemplateElementOpenOp = {
    type: OpType.templateElementOpen;
    staticAttributes: Map<string, string>;
    // We need dynamic attributes here so we can emit the `<template`, all attributes, and then `>`
    // from one operation
    dynamicAttributes: Pick<AttributeBindingOp, "name" | "attributeType" | "directive">[];
};

/**
 * Operation to emit a template element closing tag
 */
export type TemplateElementCloseOp = {
    type: OpType.templateElementClose;
};

/**
 * Operation to emit to custom-element attributes
 */
export type CustomElementAttributes = {
    type: OpType.customElementAttributes;
};

export type Op =
    | AttributeBindingOp
    | CustomElementOpenOp
    | CustomElementCloseOp
    | DirectiveOp
    | CustomElementAttributes
    | CustomElementShadowOp
    | TemplateElementOpenOp
    | TemplateElementCloseOp
    | TextOp;
