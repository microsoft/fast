import type { Callable } from "./interfaces";
import { TrustedTypesPolicy } from "./platform";
/** @internal */
export declare const _interpolationStart: string;
/** @internal */
export declare const _interpolationEnd: string;
/**
 * Common DOM APIs.
 * @public
 */
export declare const DOM: Readonly<{
    /**
     * Indicates whether the DOM supports the adoptedStyleSheets feature.
     */
    supportsAdoptedStyleSheets: boolean;
    /**
     * Sets the HTML trusted types policy used by the templating engine.
     * @param policy - The policy to set for HTML.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    setHTMLPolicy(policy: TrustedTypesPolicy): void;
    /**
     * Turns a string into trusted HTML using the configured trusted types policy.
     * @param html - The string to turn into trusted HTML.
     * @remarks
     * Used internally by the template engine when creating templates
     * and setting innerHTML.
     */
    createHTML(html: string): string;
    /**
     * Determines if the provided node is a template marker used by the runtime.
     * @param node - The node to test.
     */
    isMarker(node: Node): node is Comment;
    /**
     * Given a marker node, extract the {@link HTMLDirective} index from the placeholder.
     * @param node - The marker node to extract the index from.
     */
    extractDirectiveIndexFromMarker(node: Comment): number;
    /**
     * Creates a placeholder string suitable for marking out a location *within*
     * an attribute value or HTML content.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by binding directives.
     */
    createInterpolationPlaceholder(index: number): string;
    /**
     * Creates a placeholder that manifests itself as an attribute on an
     * element.
     * @param attributeName - The name of the custom attribute.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
     */
    createCustomAttributePlaceholder(attributeName: string, index: number): string;
    /**
     * Creates a placeholder that manifests itself as a marker within the DOM structure.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by structural directives such as `repeat`.
     */
    createBlockPlaceholder(index: number): string;
    /**
     * Schedules DOM update work in the next async batch.
     * @param callable - The callable function or object to queue.
     */
    queueUpdate(callable: Callable): void;
    /**
     * Resolves with the next DOM update.
     */
    nextUpdate(): Promise<void>;
    /**
     * Sets an attribute value on an element.
     * @param element - The element to set the attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is `null` or `undefined`, the attribute is removed, otherwise
     * it is set to the provided value using the standard `setAttribute` API.
     */
    setAttribute(element: HTMLElement, attributeName: string, value: any): void;
    /**
     * Sets a boolean attribute value.
     * @param element - The element to set the boolean attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is true, the attribute is added; otherwise it is removed.
     */
    setBooleanAttribute(
        element: HTMLElement,
        attributeName: string,
        value: boolean
    ): void;
    /**
     * Removes all the child nodes of the provided parent node.
     * @param parent - The node to remove the children from.
     */
    removeChildNodes(parent: Node): void;
    /**
     * Creates a TreeWalker configured to walk a template fragment.
     * @param fragment - The fragment to walk.
     */
    createTemplateWalker(fragment: DocumentFragment): TreeWalker;
}>;
