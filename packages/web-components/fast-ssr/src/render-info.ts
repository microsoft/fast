/**
 * This file was ported from {@link https://github.com/lit/lit/tree/main/packages/labs/ssr}.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */
import {
    ConstructableElementRenderer,
    ElementRenderer,
} from "./element-renderer/interfaces.js";

/**
 * @beta
 */
export type RenderInfo = {
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
     */
    customElementHostStack: ElementRenderer[];
};

/**
 * Default RenderInfo implementation
 *
 * @internal
 */
export class DefaultRenderInfo implements RenderInfo {
    public customElementHostStack: ElementRenderer[] = [];
    public customElementInstanceStack: ElementRenderer[] = [];
    constructor(public elementRenderers: ConstructableElementRenderer[] = []) {}
}
