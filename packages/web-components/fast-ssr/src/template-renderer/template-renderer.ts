import { RenderInfo } from "@lit-labs/ssr";
import { getElementRenderer } from "@lit-labs/ssr/lib/element-renderer.js";
import {
    Aspect,
    AspectedHTMLDirective,
    ExecutionContext,
    ViewTemplate,
} from "@microsoft/fast-element";
import { Op, OpType } from "../template-parser/op-codes.js";
import {
    parseStringToOpCodes,
    parseTemplateToOpCodes,
} from "../template-parser/template-parser.js";
import { DirectiveRenderer } from "./directives.js";

export type ComponentDOMEmissionMode = "shadow" | "light";
export interface TemplateRendererConfiguration {
    /**
     * Controls whether the template renderer should emit component template code to the component's shadow DOM or to its light DOM.
     * @default "shadow"
     */
    componentDOMEmissionMode?: ComponentDOMEmissionMode;

    /**
     * Controls whether the template renderer should emit FASTStyle elements for stylesheets.
     * Using FASTStyle can help reduce the SSR payload by only emitting stylesheet content once,
     * and leveraging a Custom Element to map those stylesheets back to FAST element's on the client.
     * @default false
     */
    useFASTStyle?: boolean;
}

export class TemplateRenderer
    implements Readonly<Required<TemplateRendererConfiguration>> {
    private directiveRenderers: Map<any, DirectiveRenderer<any>> = new Map();
    /**
     * {@inheritDoc TemplateRendererConfiguration.componentDOMEmissionMode}
     */
    public readonly componentDOMEmissionMode: ComponentDOMEmissionMode = "shadow";

    /** {@inheritdoc TemplateRendererConfiguration.useFASTStyle} */
    public readonly useFASTStyle: boolean = false;
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
        template: ViewTemplate | string,
        renderInfo: RenderInfo,
        source: unknown = undefined,
        context: ExecutionContext = ExecutionContext.default
    ): IterableIterator<string> {
        const codes =
            template instanceof ViewTemplate
                ? parseTemplateToOpCodes(template)
                : parseStringToOpCodes(template, []);

        yield* this.renderOpCodes(codes, renderInfo, source, context);
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
        source: unknown,
        context: ExecutionContext
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
                            .render(directive, renderInfo, source, this, context);
                    } else if (
                        directive instanceof AspectedHTMLDirective &&
                        directive.binding
                    ) {
                        const result = directive.binding(source, context);

                        // If the result is a template, render the template
                        if (result instanceof ViewTemplate) {
                            yield* this.render(result, renderInfo, source, context);
                        } else if (result === null || result === undefined) {
                            // Don't yield anything if result is null
                            break;
                        } else if (directive.aspect === Aspect.content) {
                            yield result;
                        } else {
                            // debugging error - we should handle all result cases
                            throw new Error(
                                `Unknown AspectedHTMLDirective result found: ${result}`
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
                    const { aspect, target, binding } = code;
                    // Don't emit anything for events or directives without bindings
                    if (aspect === Aspect.event) {
                        break;
                    }

                    let result = binding(source, context);

                    if (code.useCustomElementInstance) {
                        const instance =
                            renderInfo.customElementInstanceStack[
                                renderInfo.customElementInstanceStack.length - 1
                            ];

                        if (instance) {
                            switch (aspect) {
                                case Aspect.property:
                                    instance.setProperty(target, result);
                                    break;
                                case Aspect.tokenList:
                                    instance.setAttribute("class", result);
                                    break;
                                default:
                                    instance.setAttribute(target, result);
                                    break;
                            }
                        }
                    } else {
                        // Only yield attributes as strings for native elements.
                        // All custom-element attributes are emitted in the
                        // OpType.customElementAttributes case
                        switch (aspect) {
                            case Aspect.booleanAttribute:
                                if (!!result) {
                                    result = "";
                                    yield target;
                                }
                                break;
                            case Aspect.attribute:
                                if (result !== null && result !== undefined) {
                                    yield `${target}="${result}"`;
                                }
                                break;
                            case Aspect.tokenList:
                                if (code.target === "classList") {
                                    yield `class="${result}"`;
                                }
                                break;
                        }
                    }

                    break;
                }

                case OpType.templateElementOpen:
                    yield "<template";
                    for (const [name, value] of code.staticAttributes) {
                        yield ` ${name}="${value}"`;
                    }

                    for (const attr of code.dynamicAttributes) {
                        yield ` ${attr.target}="${attr.binding(source, context)}"`;
                    }
                    yield ">";
                    break;
                case OpType.templateElementClose:
                    yield "</template>";
                    break;

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
