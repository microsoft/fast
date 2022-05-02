import { RenderInfo } from "@lit-labs/ssr";
import { getElementRenderer } from "@lit-labs/ssr/lib/element-renderer.js";
import {
    Aspect,
    Aspected,
    ExecutionContext,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import { AttributeBindingOp, Op, OpType } from "../template-parser/op-codes.js";
import {
    parseStringToOpCodes,
    parseTemplateToOpCodes,
} from "../template-parser/template-parser.js";
import { ViewBehaviorFactoryRenderer } from "./directives.js";

function getLast<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

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
    private viewBehaviorFactoryRenderers: Map<
        any,
        ViewBehaviorFactoryRenderer<any>
    > = new Map();
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
                : parseStringToOpCodes(template, {});

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
                case OpType.viewBehaviorFactory: {
                    const factory = code.factory as ViewBehaviorFactory & Aspected;
                    const ctor = factory.constructor;
                    if (this.viewBehaviorFactoryRenderers.has(ctor)) {
                        yield* this.viewBehaviorFactoryRenderers
                            .get(ctor)!
                            .render(factory, renderInfo, source, this, context);
                    } else if (factory.aspectType && factory.binding) {
                        const result = factory.binding(source, context);

                        // If the result is a template, render the template
                        if (result instanceof ViewTemplate) {
                            yield* this.render(result, renderInfo, source, context);
                        } else if (result === null || result === undefined) {
                            // Don't yield anything if result is null
                            break;
                        } else if (factory.aspectType === Aspect.content) {
                            yield result;
                        } else {
                            // debugging error - we should handle all result cases
                            throw new Error(
                                `Unknown AspectedHTMLDirective result found: ${result}`
                            );
                        }
                    } else {
                        // Throw if a SSR directive implementation cannot be found.
                        throw new Error(
                            `Unable to process view behavior factory: ${factory}`
                        );
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
                    const { aspect, binding } = code;
                    // Don't emit anything for events or directives without bindings
                    if (aspect === Aspect.event) {
                        break;
                    }

                    const result = binding(source, context);
                    switch (aspect) {
                        case Aspect.property:
                        case Aspect.tokenList:
                            yield* this.renderProperty(code, result, renderInfo);
                            break;
                        case Aspect.booleanAttribute: {
                            yield* this.renderBooleanAttribute(code, result, renderInfo);
                            break;
                        }

                        case Aspect.attribute:
                            yield* this.renderAttribute(code, result, renderInfo);
                            break;

                        default:
                            throw new Error(
                                `Unknown aspect type '${aspect}' encountered for '${code.target}' binding.`
                            );
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
     * @param renderers - The directive renderers to register
     */
    public withViewBehaviorFactoryRenderers(
        ...renderers: ViewBehaviorFactoryRenderer<any>[]
    ): void {
        for (const renderer of renderers) {
            this.viewBehaviorFactoryRenderers.set(renderer.matcher, renderer);
        }
    }

    /**
     * Renders an attribute binding
     */
    private *renderAttribute(
        code: AttributeBindingOp,
        value: any,
        renderInfo: RenderInfo
    ) {
        if (value !== null && value !== undefined) {
            const { target } = code;
            if (code.useCustomElementInstance) {
                const instance = getLast(renderInfo.customElementInstanceStack);

                if (instance) {
                    instance.setAttribute(target, value);
                }
            } else {
                yield `${target}="${value}"`;
            }
        }
    }

    /**
     * Renders a property or tokenList binding
     */
    private *renderProperty(
        code: AttributeBindingOp,
        value: any,
        renderInfo: RenderInfo
    ) {
        const { target } = code;
        if (code.useCustomElementInstance) {
            const instance = getLast(renderInfo.customElementInstanceStack);

            if (instance) {
                switch (code.aspect) {
                    case Aspect.property:
                        instance.setProperty(target, value);
                        break;
                    case Aspect.tokenList:
                        instance.setAttribute("class", value);
                        break;
                }
            }
        } else if (target === "classList" || target === "className") {
            yield `class="${value}"`;
        }
    }

    /**
     * Renders a boolean attribute binding
     */
    private *renderBooleanAttribute(
        code: AttributeBindingOp,
        value: unknown,
        renderInfo: RenderInfo
    ) {
        if (value) {
            const { target } = code;

            if (code.useCustomElementInstance) {
                const instance = getLast(renderInfo.customElementInstanceStack);

                if (instance) {
                    instance.setAttribute(target, "");
                }
            } else {
                yield target;
            }
        }
    }
}
