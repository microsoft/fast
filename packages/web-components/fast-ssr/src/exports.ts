import { FASTElement, FASTElementDefinition } from "@microsoft/fast-element";
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

/**
 * Configuration for SSR factory.
 * @beta
 */
export interface SSRConfiguration {
    /**
     * When 'async', configures the renderer to support async rendering.
     * 'async' rendering will yield 'string | Promise<string>'
     *
     * Defaults to 'sync'.
     */
    renderMode?: "sync" | "async";

    /**
     * Configures the renderer to yield the `defer-hydration` attribute during element rendering.
     * Can be a boolean or a function that receives tagName and returns a boolean.
     * The `defer-hydration` attribute can be used to prevent immediate hydration of the element
     * by fast-element by importing hydration support in the client bundle.
     *
     * Defaults to `false`
     * @example
     *
     * ```ts
     * import "@microsoft/fast-element/install-element-hydration";
     * ```
     */
    deferHydration?: boolean | ((tagName: string) => boolean);

    /**
     * Configures the renderer to emit markup that allows fast-element to hydrate elements.
     *
     * Defaults to `false`
     */
    emitHydratableMarkup?: boolean;

    /**
     * Renderers for author-defined ViewBehaviorFactories.
     */
    viewBehaviorFactoryRenderers?: ViewBehaviorFactoryRenderer<any>[];

    /**
     * When true or when a error handler is provided, the renderer will
     * attempt to recover from errors that occur at specific points,
     * during rendering, including:
     *
     * connectedCallback(): No declarative shadow-dom will be emitted for the element
     */
    tryRecoverFromError?: boolean | ((e: unknown) => void);

    /**
     * Optional custom style renderer instance, used to override StyleElementStyleRenderer
     */
    styleRenderer?: StyleRenderer;
}

/** @beta */
function fastSSR(): {
    templateRenderer: TemplateRenderer;
    ElementRenderer: ConstructableFASTElementRenderer<SyncFASTElementRenderer>;
};
/** @beta */
function fastSSR(config: Omit<SSRConfiguration, "renderMode">): {
    templateRenderer: TemplateRenderer;
    ElementRenderer: ConstructableFASTElementRenderer<SyncFASTElementRenderer>;
};
/** @beta */
function fastSSR(config: SSRConfiguration & Record<"renderMode", "sync">): {
    templateRenderer: TemplateRenderer;
    ElementRenderer: ConstructableFASTElementRenderer<SyncFASTElementRenderer>;
};
/** @beta */
function fastSSR(config: SSRConfiguration & Record<"renderMode", "async">): {
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
    const rConfig: Required<SSRConfiguration> = {
        renderMode: "sync",
        deferHydration: false,
        emitHydratableMarkup: false,
        tryRecoverFromError: false,
        ...config,
    } as Required<SSRConfiguration>;
    const templateRenderer = new DefaultTemplateRenderer();
    const deferHydration =
        typeof rConfig.deferHydration === "function"
            ? rConfig.deferHydration
            : () => !!rConfig?.deferHydration;
    templateRenderer.deferHydration = deferHydration;
    templateRenderer.emitHydratableMarkup = !!rConfig.emitHydratableMarkup;
    templateRenderer.tryRecoverFromErrors = rConfig.tryRecoverFromError;

    const elementRenderer = class extends (rConfig.renderMode !== "async"
        ? SyncFASTElementRenderer
        : AsyncFASTElementRenderer) {
        static #disabledConstructors = new Set<typeof HTMLElement | string>();

        public static matchesClass(
            ctor: typeof HTMLElement,
            tagName: string,
            attributes: AttributesMap
        ): boolean {
            if (FASTElementDefinition.getByType(ctor) === undefined) {
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
        protected styleRenderer =
            rConfig.styleRenderer || new StyleElementStyleRenderer();
        protected deferHydration = deferHydration;
    };

    templateRenderer.withDefaultElementRenderers(
        elementRenderer as unknown as ConstructableElementRenderer
    );

    // Configure out-of-box ViewBehaviorFactory renderers first
    templateRenderer.withViewBehaviorFactoryRenderers(
        ...defaultViewBehaviorFactoryRenderers
    );

    // Add any author-defined ViewBehaviorFactories. This order allows overriding
    // out-of-box renderers.
    if (Array.isArray(rConfig.viewBehaviorFactoryRenderers)) {
        templateRenderer.withViewBehaviorFactoryRenderers(
            ...rConfig.viewBehaviorFactoryRenderers
        );
    }

    return {
        templateRenderer,
        ElementRenderer: elementRenderer,
    };
}

export default fastSSR;
export * from "./declarative-shadow-dom-polyfill.js";
export * from "./request-storage.js";
export { templateCacheController } from "./template-parser/template-parser.js";
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

export { TemplateRendererEventTypes } from "./template-renderer/events.js";
export type { TemplateRendererEvent } from "./template-renderer/events.js";
