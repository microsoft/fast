import { Aspected, ViewBehaviorFactory, ViewTemplate } from "@microsoft/fast-element";
import { IDManager } from "./id-generator.js";

/**
 * Allows fast identification of operation types
 */
export const enum OpType {
    customElementOpen,
    customElementClose,
    customElementAttributes,
    customElementShadow,
    attributeBinding,
    attributeBindingMarker,
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

export type AttributeBindingMarkerOp = {
    type: OpType.attributeBindingMarker;
    indexes: number[];
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
    ctor?: typeof HTMLElement;

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
 * Operation to emit a ViewBehaviorFactory
 */
export type ViewBehaviorFactoryOp = {
    type: OpType.viewBehaviorFactory;
    factory: ViewBehaviorFactory;

    /**
     * The index of the factory in the collection of ViewBehaviorFactories
     * in a template.
     */
    index: number;
};

/**
 * Operation to emit a bound attribute
 */
export type AttributeBindingOp = {
    type: OpType.attributeBinding;
    factory: ViewBehaviorFactory & Aspected;
    useCustomElementInstance: boolean;

    /**
     * The indexes of the bindings in the collection of ViewBehaviorFactories.
     */
    index: number;
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
    | AttributeBindingMarkerOp
    | CustomElementOpenOp
    | CustomElementCloseOp
    | ViewBehaviorFactoryOp
    | CustomElementAttributes
    | CustomElementShadowOp
    | TemplateElementOpenOp
    | TemplateElementCloseOp
    | TextOp;

export class OpCodes extends Array<Op> {
    private static readonly cache: WeakMap<ViewTemplate, OpCodes> = new WeakMap();
    public readonly id = IDManager.getFor(this);

    static get(key: ViewTemplate) {
        return OpCodes.cache.get(key);
    }

    static set(key: ViewTemplate, value: OpCodes) {
        return OpCodes.cache.set(key, value);
    }

    static has(key: ViewTemplate) {
        return OpCodes.cache.has(key);
    }
}
