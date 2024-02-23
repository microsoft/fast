import {
    Aspected,
    DOMAspect,
    ExecutionContext,
    FASTElementDefinition,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DefaultRenderInfo, RenderInfo } from "../render-info.js";
import { getElementRenderer } from "../element-renderer/element-renderer.js";
import {
    AsyncElementRenderer,
    ConstructableElementRenderer,
} from "../element-renderer/interfaces.js";
import { AttributeBindingOp, Op, OpType } from "../template-parser/op-codes.js";
import {
    parseStringToOpCodes,
    parseTemplateToOpCodes,
} from "../template-parser/template-parser.js";
import { ViewBehaviorFactoryRenderer } from "./directives.js";

function getLast<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

/** @beta */
export interface TemplateRenderer {
    render(
        template: ViewTemplate | string,
        renderInfo?: RenderInfo,
        source?: unknown,
        context?: ExecutionContext
    ): IterableIterator<string>;
    createRenderInfo(): RenderInfo;
    withDefaultElementRenderers(...renderers: ConstructableElementRenderer[]): void;
}

/** @beta */
export interface AsyncTemplateRenderer {
    render(
        template: ViewTemplate | string,
        renderInfo?: RenderInfo,
        source?: unknown,
        context?: ExecutionContext
    ): IterableIterator<string | Promise<string>>;
    createRenderInfo(): RenderInfo;
    withDefaultElementRenderers(
        ...renderers: ConstructableElementRenderer<AsyncElementRenderer>[]
    ): void;
}

/**
 * A class designed to render HTML templates. The renderer supports
 * rendering {@link @microsoft/fast-element#ViewTemplate} instances as well
 * as arbitrary HTML strings.
 *
 * @internal
 */
export class DefaultTemplateRenderer implements TemplateRenderer {
    private viewBehaviorFactoryRenderers: Map<any, ViewBehaviorFactoryRenderer<any>> =
        new Map();

    private defaultElementRenderers: ConstructableElementRenderer[] = [];

    /**
     * Renders a {@link @microsoft/fast-element#ViewTemplate} or HTML string.
     * @param template - The template to render.
     * @param renderInfo - Information about the rendering context.
     * @param source - Any source data to render the template and evaluate bindings with.
     * @param context - The {@link @microsoft/fast-element#ExecutionContext} to render with.
     */
    public *render(
        template: ViewTemplate | string,
        renderInfo: RenderInfo = this.createRenderInfo(),
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
                    } else if (factory.aspectType && factory.dataBinding) {
                        const result = factory.dataBinding.evaluate(source, context);

                        // If the result is a template, render the template
                        if (result instanceof ViewTemplate) {
                            yield* this.render(result, renderInfo, source, context);
                        } else if (result === null || result === undefined) {
                            // Don't yield anything if result is null
                            break;
                        } else if (factory.aspectType === DOMAspect.content) {
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
                    const currentRenderer = getLast(
                        renderInfo.customElementInstanceStack
                    );

                    if (currentRenderer) {
                        // simulate DOM connection
                        currentRenderer.connectedCallback();

                        // Allow the renderer to hoist any attribute values it needs to
                        yield* currentRenderer.renderAttributes();
                    }

                    break;
                }

                case OpType.customElementShadow: {
                    const currentRenderer = getLast(
                        renderInfo.customElementInstanceStack
                    );
                    if (!currentRenderer) {
                        break;
                    }

                    // FAST components with a shadowOptions assigned `undefined`
                    // render to light DOM client-side. If SSR encounters this,
                    // simply skip rendering declarative shadow DOM so the
                    // element template renders into the current root.
                    const ctor = customElements.get(currentRenderer.tagName);
                    const skipDSD =
                        ctor &&
                        FASTElementDefinition.getByType(ctor)?.shadowOptions ===
                            undefined;

                    if (!skipDSD) {
                        yield '<template shadowroot="open">';
                    }

                    const content = currentRenderer.renderShadow(renderInfo);

                    if (content) {
                        yield* content;
                    }

                    if (!skipDSD) {
                        yield "</template>";
                    }

                    break;
                }

                case OpType.attributeBinding: {
                    const { aspect, dataBinding: binding } = code;
                    // Don't emit anything for events or directives without bindings
                    if (aspect === DOMAspect.event) {
                        break;
                    }

                    const result = binding.evaluate(source, context);
                    const renderer = this.getAttributeBindingRenderer(code);

                    if (renderer) {
                        yield* renderer(code, result, renderInfo);
                    }

                    break;
                }

                case OpType.templateElementOpen:
                    yield "<template";
                    for (const [name, value] of code.staticAttributes) {
                        yield ` ${DefaultTemplateRenderer.formatAttribute(name, value)}`;
                    }

                    for (const attr of code.dynamicAttributes) {
                        const renderer = this.getAttributeBindingRenderer(attr);

                        if (renderer) {
                            const result = attr.dataBinding.evaluate(source, context);
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
     * Constructs a new {@link RenderInfo } object.
     * @param renderers - the ElementRenderer constructors the RenderInfo should contain
     * @returns
     */
    public createRenderInfo(
        renderers: ConstructableElementRenderer[] = this.defaultElementRenderers
    ): RenderInfo {
        return new DefaultRenderInfo(renderers.concat());
    }

    /**
     * Configures the ElementRenderers used during RenderInfo construction by {@link DefaultTemplateRenderer.createRenderInfo}
     * and the default RenderInfo argument used by {@link DefaultTemplateRenderer.render}.
     * @param renderers - The ElementRenderers to use by default.
     */
    public withDefaultElementRenderers(...renderers: ConstructableElementRenderer[]) {
        this.defaultElementRenderers = renderers;
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
            case DOMAspect.booleanAttribute:
                return DefaultTemplateRenderer.renderBooleanAttribute;
            case DOMAspect.property:
            case DOMAspect.tokenList:
                return DefaultTemplateRenderer.renderProperty;
            case DOMAspect.attribute:
                return DefaultTemplateRenderer.renderAttribute;
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
                yield DefaultTemplateRenderer.formatAttribute(target, value);
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
                    case DOMAspect.property:
                        instance.setProperty(target, value);
                        break;
                    case DOMAspect.tokenList:
                        instance.setAttribute("class", value);
                        break;
                }
            }
        } else if (target === "classList" || target === "className") {
            yield DefaultTemplateRenderer.formatAttribute("class", value);
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
                yield DefaultTemplateRenderer.formatAttribute(target, value);
            }
        }
    }
}
