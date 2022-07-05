import {
    Aspect,
    Aspected,
    ExecutionContext,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import { RenderInfo } from "../render-info.js";
import { getElementRenderer } from "../element-renderer/element-renderer.js";
import { AttributeBindingOp, Op, OpType } from "../template-parser/op-codes.js";
import {
    parseStringToOpCodes,
    parseTemplateToOpCodes,
} from "../template-parser/template-parser.js";
import { ViewBehaviorFactoryRenderer } from "./directives.js";

function getLast<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

/**
 * The mode for which a component's internals should be rendered.
 * @beta
 */
export type ComponentDOMEmissionMode = "shadow";

/**
 * A class designed to render HTML templates. The renderer supports
 * rendering {@link @microsoft/fast-element#ViewTemplate} instances as well
 * as arbitrary HTML strings.
 *
 * @beta
 */
export class TemplateRenderer {
    private viewBehaviorFactoryRenderers: Map<
        any,
        ViewBehaviorFactoryRenderer<any>
    > = new Map();

    /**
     * Controls how the {@link TemplateRenderer} will emit component DOM internals.
     */
    public readonly componentDOMEmissionMode: ComponentDOMEmissionMode = "shadow";

    /**
     * Renders a {@link @microsoft/fast-element#ViewTemplate} or HTML string.
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
     * @param codes - the op codes to render.
     * @param renderInfo - renderInfo context.
     * @param source - source data.
     *
     * @internal
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
                    const renderer = this.viewBehaviorFactoryRenderers.get(ctor);
                    if (renderer) {
                        yield* renderer.render(
                            factory,
                            renderInfo,
                            source,
                            this,
                            context
                        );
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
                    const renderer = this.getAttributeBindingRenderer(code);

                    if (renderer) {
                        yield* renderer(code, result, renderInfo);
                    }

                    break;
                }

                case OpType.templateElementOpen:
                    yield "<template";
                    for (const [name, value] of code.staticAttributes) {
                        yield ` ${TemplateRenderer.formatAttribute(name, value)}`;
                    }

                    for (const attr of code.dynamicAttributes) {
                        const renderer = this.getAttributeBindingRenderer(attr);

                        if (renderer) {
                            const result = attr.binding(source, context);
                            yield " ";
                            yield* renderer(attr, result, renderInfo);
                        }
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
     *
     * @internal
     */
    public withViewBehaviorFactoryRenderers(
        ...renderers: ViewBehaviorFactoryRenderer<any>[]
    ): void {
        for (const renderer of renderers) {
            this.viewBehaviorFactoryRenderers.set(renderer.matcher, renderer);
        }
    }

    private getAttributeBindingRenderer(code: AttributeBindingOp) {
        switch (code.aspect) {
            case Aspect.booleanAttribute:
                return TemplateRenderer.renderBooleanAttribute;
            case Aspect.property:
            case Aspect.tokenList:
                return TemplateRenderer.renderProperty;
            case Aspect.attribute:
                return TemplateRenderer.renderAttribute;
        }
    }

    /**
     * Format attribute key/value pair into a HTML attribute string.
     * @param name - the attribute name.
     * @param value - the attribute value.
     */
    private static formatAttribute(name: string, value: string) {
        return value === "" ? name : `${name}="${value}"`;
    }

    /**
     * Renders an attribute binding
     */
    private static *renderAttribute(
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
                yield TemplateRenderer.formatAttribute(target, value);
            }
        }
    }

    /**
     * Renders a property or tokenList binding
     */
    private static *renderProperty(
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
            yield TemplateRenderer.formatAttribute("class", value);
        }
    }

    /**
     * Renders a boolean attribute binding
     */
    private static *renderBooleanAttribute(
        code: AttributeBindingOp,
        value: unknown,
        renderInfo: RenderInfo
    ) {
        if (value) {
            const value = "";
            const { target } = code;

            if (code.useCustomElementInstance) {
                const instance = getLast(renderInfo.customElementInstanceStack);

                if (instance) {
                    instance.setAttribute(target, value);
                }
            } else {
                yield TemplateRenderer.formatAttribute(target, value);
            }
        }
    }
}
