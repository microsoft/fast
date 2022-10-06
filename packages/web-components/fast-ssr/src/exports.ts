import {
    AsyncFASTElementRenderer,
    SyncFASTElementRenderer,
} from "./element-renderer/fast-element-renderer.js";
import {
    AsyncElementRenderer,
    ConstructableElementRenderer,
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
    renderMode: "sync" | "async";
}

/** @beta */
function fastSSR(): {
    templateRenderer: TemplateRenderer;
    ElementRenderer: ConstructableElementRenderer;
};
/** @beta */
function fastSSR(
    config: SSRConfiguration & Record<"renderMode", "sync">
): {
    templateRenderer: TemplateRenderer;
    ElementRenderer: ConstructableElementRenderer;
};
/** @beta */
function fastSSR(
    config: SSRConfiguration & Record<"renderMode", "async">
): {
    templateRenderer: AsyncTemplateRenderer;
    ElementRenderer: ConstructableElementRenderer<AsyncElementRenderer>;
};
/**
 * Factory for creating SSR rendering assets.
 * @example
 * ```ts
 * import "@microsoft/install-dom-shim";
 * import fastSSR from "@microsoft/fast-ssr";
 * import { html } from "@microsoft/fast-element";
 * const { templateRenderer, defaultRenderInfo } = fastSSR();
 *
 * const streamableSSRResult = templateRenderer.render(html`...`, defaultRenderInfo);
 * ```
 *
 * @beta
 */
function fastSSR(config?: SSRConfiguration): any {
    const async = config && config.renderMode === "async";
    const templateRenderer = new DefaultTemplateRenderer();
    const elementRenderer = !async
        ? class extends SyncFASTElementRenderer {
              protected templateRenderer: DefaultTemplateRenderer = templateRenderer;
              protected styleRenderer = new StyleElementStyleRenderer();
          }
        : class extends AsyncFASTElementRenderer {
              protected templateRenderer: DefaultTemplateRenderer = templateRenderer;
              protected styleRenderer = new StyleElementStyleRenderer();
          };

    templateRenderer.withDefaultElementRenderers(
        elementRenderer as ConstructableElementRenderer
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
};
