import { RenderInfo } from "@lit-labs/ssr";
import {
    defaultExecutionContext,
    InlinableHTMLDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
import { OpType } from "../template-parser/op-codes.js";
import { parseTemplateToOpCodes } from "../template-parser/template-parser.js";

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
        const codes = parseTemplateToOpCodes(template);

        for (const code of codes) {
            switch (code.type) {
                case OpType.text:
                    yield code.value;
                    break;
                case OpType.directive: {
                    const { directive } = code;

                    if (directive instanceof InlinableHTMLDirective) {
                        const result = directive.binding(source, defaultExecutionContext);

                        // If the result is a template, render the template
                        if (result instanceof ViewTemplate) {
                            yield* this.render(result, renderInfo, source);
                        } else if (result === null || result === undefined) {
                            // Don't yield anything if result is null
                            break;
                        } else {
                            // debugging error - we should handle all result cases
                            throw new Error(
                                `Unknown InlineableHTMLDirective result found: ${result}`
                            );
                        }
                    } else {
                        // Throw if a SSR directive implementation cannot be found.
                        throw new Error(`Unable to process HTMLDirective: ${directive}`);
                    }

                    break;
                }

                default:
                    throw new Error(`Unable to interpret op code '${OpType[code.type]}'`);
            }
        }
    }
}
