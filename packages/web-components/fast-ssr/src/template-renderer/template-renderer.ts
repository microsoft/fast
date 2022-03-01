import { ViewTemplate } from "@microsoft/fast-element";
import { RenderInfo } from "@lit-labs/ssr";

export type ComponentDOMEmissionMode = "shadow" | "light";
export interface TemplateRendererConfiguration {
    /**
     * Controls whether the template renderer should emit component template code to the component's shadow DOM or to its light DOM.
     */
    componentDOMEmissionMode: ComponentDOMEmissionMode;
}

export class TemplateRenderer implements Readonly<TemplateRendererConfiguration> {
    /**
     * {@inheritDoc TemplateRendererConfiguration.componentDOMEmissionMode}
     */
    public readonly componentDOMEmissionMode: ComponentDOMEmissionMode = "shadow";
    constructor(config?: TemplateRendererConfiguration) {
        if (config) {
            Object.assign(this, config);
        }
    }

    /**
     *
     * @param template - The template to render.
     * @param renderInfo - Information about the rendering context.
     * @param source - Any source data to render the template and evaluate bindings with.
     */
    public *render(
        template: ViewTemplate,
        renderInfo: RenderInfo,
        source?: unknown
    ): IterableIterator<string> {
        yield "";
    }
}
