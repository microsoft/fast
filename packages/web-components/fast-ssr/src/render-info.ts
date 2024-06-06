/**
 * This file was ported from {@link https://github.com/lit/lit/tree/main/packages/labs/ssr}.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */
import { Disposable } from "@microsoft/fast-element";
import {
    ConstructableElementRenderer,
    ElementRenderer,
} from "./element-renderer/interfaces.js";

/**
 * @beta
 */
export interface RenderInfo extends Disposable {
    /**
     * Element renderers to use
     */
    elementRenderers: ConstructableElementRenderer[];

    /**
     * Stack of open custom elements (in light dom or shadow dom)
     */
    customElementInstanceStack: ElementRenderer[];

    /**
     * Stack of open host custom elements (n-1 will be n's host)
     * @deprecated - use {@link  (RenderInfo:interface).customElementInstanceStack}
     */
    customElementHostStack: ElementRenderer[];

    /**
     * A list of all Rendered custom elements.
     */
    renderedCustomElementList: ElementRenderer[];
}

/**
 * Default RenderInfo implementation
 *
 * @internal
 */
export class DefaultRenderInfo implements RenderInfo {
    public customElementHostStack: ElementRenderer[] = [];
    public customElementInstanceStack: ElementRenderer[] = [];
    public renderedCustomElementList: ElementRenderer[] = [];
    constructor(public elementRenderers: ConstructableElementRenderer[] = []) {}

    public dispose(): void {
        for (const rendered of this.renderedCustomElementList) {
            rendered.disconnectedCallback();
        }

        for (let i = this.customElementInstanceStack.length - 1; i >= 0; i--) {
            this.customElementInstanceStack[i].disconnectedCallback();
        }

        // renderedCustomElementList was kept to cleanup custom elements after render; clear it after disconnect so it can be GC'd if needed
        this.renderedCustomElementList = [];
        this.customElementInstanceStack = [];
    }
}
