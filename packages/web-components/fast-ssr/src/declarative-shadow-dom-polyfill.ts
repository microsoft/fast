// Reference: https://web.dev/declarative-shadow-dom/

/**
 * Provides style and JavaScript code snippets for polyfills related
 * to Declarative Shadow DOM (DSD).
 * @beta
 */
export const DeclarativeShadowDOMPolyfill = Object.freeze({
    /**
     * Styles that hide undefined elements, taking account of the
     * fact that undefined elements with DSD should not be hidden.
     * @remarks
     * These styles should be used in a style element tag in the head
     * of the HTML document.
     */
    undefinedElementStyles: `:not(:defined) > template[shadowroot] ~ *  {
    display: none;
}` as string,
    /**
     * A JavaScript polyfill for DSD that recursively converts all templates
     * in the document with the shadowroot attribute into actual shadow roots.
     * @remarks
     * This is a one-time operation that should be placed at the end of the SSR'd
     * HTML but before any other scripts run.
     */
    nonStreamingTemplateUpgrade:
        `if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')) {
    (function attachShadowRoots(root) {
        root.querySelectorAll("template[shadowroot]").forEach(template => {
            const mode = template.getAttribute("shadowroot");
            const shadowRoot = template.parentNode.attachShadow({ mode });
            shadowRoot.appendChild(template.content);
            template.remove();
            attachShadowRoots(shadowRoot);
        });
    })(document);
}` as string,
});
