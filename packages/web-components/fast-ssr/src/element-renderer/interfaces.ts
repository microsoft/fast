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
    matchesClass(
        ctor: typeof HTMLElement,
        tagName: string,
        attributes: AttributesMap
    ): boolean;
}

/**
 * @internal
 */
export type AttributesMap = Map<string, string>;
