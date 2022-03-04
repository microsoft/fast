import { RenderInfo } from "@lit-labs/ssr";
import { getElementRenderer } from "@lit-labs/ssr/lib/element-renderer.js";
import {
    defaultExecutionContext,
    InlinableHTMLDirective,
    ViewTemplate,
    HTMLDirective,
} from "@microsoft/fast-element";
import { AttributeType } from "../template-parser/attributes.js";
import { OpType, Op } from "../template-parser/op-codes.js";
import { parseTemplateToOpCodes } from "../template-parser/template-parser.js";
import { DirectiveRenderer } from "./directives.js";

export type ComponentDOMEmissionMode = "shadow" | "light";
export interface TemplateRendererConfiguration {
    /**
     * Controls whether the template renderer should emit component template code to the component's shadow DOM or to its light DOM.
     */
    componentDOMEmissionMode: ComponentDOMEmissionMode;
}

export class TemplateRenderer implements Readonly<TemplateRendererConfiguration> {
    private directiveRenderers: Map<any, DirectiveRenderer<any>> = new Map();
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

        yield* this.renderOpCodes(codes, renderInfo, source);
    }

    /**
     * Render a set of op codes.
     * @internal
     * @param codes
     * @param renderInfo
     * @param source
     */
    public *renderOpCodes(
        codes: Op[],
        renderInfo: RenderInfo,
        source?: unknown
    ): IterableIterator<string> {
        for (const code of codes) {
            switch (code.type) {
                case OpType.text:
                    yield code.value;
                    break;
                case OpType.directive: {
                    const { directive } = code;
                    const ctor = directive.constructor;
                    if (this.directiveRenderers.has(ctor)) {
                        yield* this.directiveRenderers
                            .get(ctor)!
                            .render(directive, renderInfo, source, this);
                    } else if (directive instanceof InlinableHTMLDirective) {
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
                case OpType.customElementOpen: {
                    const renderer = getElementRenderer(
                        renderInfo,
                        code.tagName,
                        code.ctor,
                        code.staticAttributes
                    );

                    if (renderer !== undefined) {
                        for (const [name, value] of code.staticAttributes) {
                            renderer.setAttribute(name, value);
                        }

                        renderInfo.customElementInstanceStack.push(renderer);
                    }

                    break;
                }

                case OpType.customElementClose: {
                    renderInfo.customElementInstanceStack.pop();
                    break;
                }

                case OpType.customElementAttributes: {
                    const currentRenderer =
                        renderInfo.customElementInstanceStack[
                            renderInfo.customElementInstanceStack.length - 1
                        ];
                    if (currentRenderer) {
                        // simulate DOM connection
                        currentRenderer.connectedCallback();

                        // Allow the renderer to hoist any attribute values it needs to
                        yield* currentRenderer.renderAttributes();
                    }

                    break;
                }

                case OpType.customElementShadow: {
                    yield '<template shadowroot="open">';

                    const currentRenderer =
                        renderInfo.customElementInstanceStack[
                            renderInfo.customElementInstanceStack.length - 1
                        ];
                    if (currentRenderer) {
                        const shadow = currentRenderer.renderShadow(renderInfo);

                        if (shadow) {
                            yield* shadow;
                        }
                    }

                    yield "</template>";
                    break;
                }

                case OpType.attributeBinding: {
                    const { attributeType } = code;

                    // Don't emit anything for events.
                    if (attributeType === AttributeType.event) {
                        break;
                    }

                    let result = code.directive.binding(source, defaultExecutionContext);
                    const { name } = code;

                    if (code.useCustomElementInstance) {
                        const instance =
                            renderInfo.customElementInstanceStack[
                                renderInfo.customElementInstanceStack.length - 1
                            ];

                        if (instance) {
                            attributeType === AttributeType.idl
                                ? instance.setProperty(name, result)
                                : instance.setAttribute(name, result);
                        }
                    } else {
                        // Only yield attributes as strings for native elements.
                        // All custom-element attributes are emitted in the
                        // OpType.customElementAttributes case
                        switch (attributeType) {
                            case AttributeType.booleanContent:
                                if (!!result) {
                                    result = "";
                                    yield name;
                                }
                                break;
                            case AttributeType.content:
                                if (result !== null && result !== undefined) {
                                    yield `${name}="${result}"`;
                                }
                                break;
                        }
                    }

                    break;
                }

                default:
                    throw new Error(`Unable to interpret op code '${code}'`);
            }
        }
    }

    /**
     * Registers DirectiveRenderers to use when rendering templates.
     * @param directives - The directive renderers to register
     */
    public withDirectiveRenderer(...directives: DirectiveRenderer<any>[]): void {
        for (const renderer of directives) {
            this.directiveRenderers.set(renderer.matcher, renderer);
        }
    }
}
