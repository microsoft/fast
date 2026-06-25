import { Binding, ViewBehaviorFactory } from "@microsoft/fast-element";

/**
 * Allows fast identification of operation types
 */
export const enum OpType {
    customElementOpen,
    customElementClose,
    customElementAttributes,
    customElementShadow,
    attributeBinding,
    viewBehaviorFactory,
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
export type ViewBehaviorFactoryOp = {
    type: OpType.viewBehaviorFactory;
    factory: ViewBehaviorFactory;
};

/**
 * Operation to emit a bound attribute
 */
export type AttributeBindingOp = {
    type: OpType.attributeBinding;
    dataBinding: Binding;
    target: string;
    aspect: number;
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
    dynamicAttributes: AttributeBindingOp[];
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
    | ViewBehaviorFactoryOp
    | CustomElementAttributes
    | CustomElementShadowOp
    | TemplateElementOpenOp
    | TemplateElementCloseOp
    | TextOp;
