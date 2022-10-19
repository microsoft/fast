import {
    AsyncFASTElementRenderer,
    SyncFASTElementRenderer,
} from "./element-renderer/fast-element-renderer.js";
import {
    AsyncElementRenderer,
    AttributesMap,
    ConstructableElementRenderer,
    ConstructableFASTElementRenderer,
    ElementRenderer,
} from "./element-renderer/interfaces.js";
import { RenderInfo } from "./render-info.js";
import { StyleElementStyleRenderer, StyleRenderer } from "./styles/style-renderer.js";
import {
    defaultViewBehaviorFactoryRenderers,
    ViewBehaviorFactoryRenderer,
} from "./template-renderer/directives.js";
import {
    AsyncTemplateRenderer,
    DefaultTemplateRenderer,
    TemplateRenderer,
} from "./template-renderer/template-renderer.js";

// Perform necessary configuration of FAST-Element library
// for rendering in NodeJS
import "./configure-fast-element.js";
import { FASTElement, FASTElementDefinition } from "@microsoft/fast-element";

/**
 * Configuration for SSR factory.
 * @beta
 */
export interface SSRConfiguration {
    renderMode: "sync" | "async";
}

/** @beta */
function fastSSR(): {
    templateRenderer: TemplateRenderer;
    ElementRenderer: ConstructableFASTElementRenderer<SyncFASTElementRenderer>;
};
/** @beta */
function fastSSR(
    config: SSRConfiguration & Record<"renderMode", "sync">
): {
    templateRenderer: TemplateRenderer;
    ElementRenderer: ConstructableFASTElementRenderer<SyncFASTElementRenderer>;
};
/** @beta */
function fastSSR(
    config: SSRConfiguration & Record<"renderMode", "async">
): {
    templateRenderer: AsyncTemplateRenderer;
    ElementRenderer: ConstructableFASTElementRenderer<AsyncFASTElementRenderer>;
};
/**
 * Factory for creating SSR rendering assets.
 * @example
 * ```ts
 * import "@microsoft/install-dom-shim";
 * import fastSSR from "@microsoft/fast-ssr";
 * import { html } from "@microsoft/fast-element";
 * const { templateRenderer } = fastSSR();
 *
 * const streamableSSRResult = templateRenderer.render(html`...`);
 * ```
 *
 * @beta
 */
function fastSSR(config?: SSRConfiguration): any {
    const async = config && config.renderMode === "async";
    const templateRenderer = new DefaultTemplateRenderer();

    const elementRenderer = class extends (!async
        ? SyncFASTElementRenderer
        : AsyncFASTElementRenderer) {
        static #disabledConstructors = new Set<typeof HTMLElement | string>();

        public static matchesClass(
            ctor: typeof HTMLElement,
            tagName: string,
            attributes: AttributesMap
        ): boolean {
            const canRender = ctor.prototype instanceof FASTElement;

            if (!canRender) {
                return false;
            }

            const disabled = elementRenderer.#disabledConstructors;

            return !(disabled.has(tagName) || disabled.has(ctor));
        }

        public static disable(
            ...elements: Array<string | typeof FASTElement | FASTElementDefinition>
        ) {
            for (const element of elements) {
                elementRenderer.#disabledConstructors.add(
                    element instanceof FASTElementDefinition ? element.type : element
                );
            }
        }
        protected templateRenderer: DefaultTemplateRenderer = templateRenderer;
        protected styleRenderer = new StyleElementStyleRenderer();
    };

    templateRenderer.withDefaultElementRenderers(
        (elementRenderer as unknown) as ConstructableElementRenderer
    );
    templateRenderer.withViewBehaviorFactoryRenderers(
        ...defaultViewBehaviorFactoryRenderers
    );

    return {
        templateRenderer,
        ElementRenderer: elementRenderer,
    };
}

export default fastSSR;
export * from "./declarative-shadow-dom-polyfill.js";
export * from "./request-storage.js";
export type {
    ElementRenderer,
    AsyncElementRenderer,
    StyleRenderer,
    TemplateRenderer,
    AsyncTemplateRenderer,
    ViewBehaviorFactoryRenderer,
    RenderInfo,
    ConstructableElementRenderer,
    ConstructableFASTElementRenderer,
};
