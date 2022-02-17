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
}
