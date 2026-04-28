import { FASTElement, FASTElementDefinition } from "@microsoft/fast-element";
import { RenderInfo } from "../render-info.js";

/**
 * @beta
 */
export interface ElementRenderer {
    readonly tagName: string;
    connectedCallback(): void;
    attributeChangedCallback(
        name: string,
        prev: string | null,
        next: string | null
    ): void;
    dispatchEvent(event: Event): boolean;
    setProperty(name: string, value: unknown): void;
    setAttribute(name: string, value: string): void;
    renderShadow(renderInfo: RenderInfo): IterableIterator<string>;
    renderAttributes(): IterableIterator<string>;
}

/**
 * @beta
 */
export interface AsyncElementRenderer
    extends Omit<ElementRenderer, "renderShadow" | "renderAttributes"> {
    renderShadow(renderInfo: RenderInfo): IterableIterator<string | Promise<string>>;
    renderAttributes(): IterableIterator<string | Promise<string>>;
}

/**
 * @beta
 */
export interface ConstructableElementRenderer<
    T extends ElementRenderer | AsyncElementRenderer = ElementRenderer
> {
    new (tagName: string, renderInfo: RenderInfo): T;

    /**
     * Tests a constructor to determine if it should be managed by the ElementRenderer.
     * @param ctor - The constructor to test.
     */
    matchesClass(
        ctor: typeof HTMLElement,
        tagName: string,
        attributes: AttributesMap
    ): boolean;
}

/**
 * @beta
 */
export interface ConstructableFASTElementRenderer<
    T extends ElementRenderer | AsyncElementRenderer = ElementRenderer
> extends ConstructableElementRenderer<T> {
    /**
     * Prevents this ElementRenderer from matching an element type.
     * @param elements - The elements to disable rendering for.
     *
     * @remarks
     * Elements can be disabled by tag-name, constructor, or FASTElementDefinition.
     */
    disable(...args: Array<string | typeof FASTElement | FASTElementDefinition>): void;
}

/**
 * @internal
 */
export type AttributesMap = Map<string, string>;
