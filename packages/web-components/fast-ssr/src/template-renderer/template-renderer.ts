import { EventEmitter } from "node:events";
import {
    Aspected,
    DOMAspect,
    ExecutionContext,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DefaultRenderInfo, RenderInfo } from "../render-info.js";
import {
    AsyncElementRenderer,
    AttributesMap,
    ConstructableElementRenderer,
    ElementRenderer,
} from "../element-renderer/interfaces.js";
import { FallbackRenderer } from "../element-renderer/element-renderer.js";
import { OpCodes, OpType } from "../template-parser/op-codes.js";
import {
    parseStringToOpCodes,
    parseTemplateToOpCodes,
} from "../template-parser/template-parser.js";
import {
    HTMLBindingDirectiveRenderer,
    ViewBehaviorFactoryRenderer,
} from "./directives.js";
import { hydrationMarker } from "./hydration-marker-emitter.js";

function getLast<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

/** @beta */
export interface TemplateRenderer extends EventEmitter {
    render(
        template: ViewTemplate | string,
        renderInfo?: RenderInfo,
        source?: unknown,
        context?: ExecutionContext
    ): IterableIterator<string>;
    createRenderInfo(): RenderInfo;
    withDefaultElementRenderers(...renderers: ConstructableElementRenderer[]): void;
    readonly emitHydratableMarkup: boolean;
}

/** @beta */
export interface AsyncTemplateRenderer extends EventEmitter {
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
    readonly emitHydratableMarkup: boolean;
}

/**
 * A class designed to render HTML templates. The renderer supports
 * rendering {@link @microsoft/fast-element#ViewTemplate} instances as well
 * as arbitrary HTML strings.
 *
 * @internal
 */
export class DefaultTemplateRenderer extends EventEmitter implements TemplateRenderer {
    private viewBehaviorFactoryRenderers: Map<any, ViewBehaviorFactoryRenderer<any>> =
        new Map();

    private defaultElementRenderers: ConstructableElementRenderer[] = [];
    public emitHydratableMarkup: boolean = false;
    public deferHydration: (tagName: string) => boolean = () => false;
    public tryRecoverFromErrors: boolean | ((e: unknown) => void) = false;

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

        // If there are no open custom elements, clean up all rendered
        // custom elements
        if (renderInfo.customElementInstanceStack.length === 0) {
            renderInfo.dispose();
        }
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
        codes: OpCodes,
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
                    const renderer = this.getFactoryRenderer(factory);

                    if (this.shouldEmitHydrationMarkup(renderInfo)) {
                        yield hydrationMarker.contentBindingStart(code.index, codes.id);
                    }

                    if (renderer) {
                        yield* renderer.render(
                            factory,
                            renderInfo,
                            source,
                            this,
                            context
                        );
                    } else {
                        // Throw if a SSR directive implementation cannot be found.
                        throw new Error(
                            `Unable to process view behavior factory: ${factory}`
                        );
                    }

                    if (this.shouldEmitHydrationMarkup(renderInfo)) {
                        yield hydrationMarker.contentBindingEnd(code.index, codes.id);
                    }

                    break;
                }
                case OpType.customElementOpen: {
                    const renderer = this.getElementRenderer(
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
                    const renderer = renderInfo.customElementInstanceStack.pop()!;
                    if (renderer) {
                        renderInfo.renderedCustomElementList.push(renderer);
                    }
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

                    const content = currentRenderer.renderShadow(renderInfo);

                    if (content) {
                        yield* content;
                    }

                    break;
                }

                case OpType.attributeBinding: {
                    const { factory } = code;
                    const factoryRenderer = this.getFactoryRenderer(factory);

                    if (
                        code.useCustomElementInstance &&
                        factoryRenderer === HTMLBindingDirectiveRenderer
                    ) {
                        if (factory.aspectType === DOMAspect.event) {
                            // No-op for event bindings
                            break;
                        }
                        // The attribute needs to be set for the element in this case
                        // because the instance will yield out it's own attributes.
                        const result = factory.dataBinding!.evaluate(source, context);
                        const instance = getLast(renderInfo.customElementInstanceStack);
                        const target = factory.targetAspect;

                        switch (factory.aspectType) {
                            case DOMAspect.attribute:
                                instance?.setAttribute(target, result);
                                break;
                            case DOMAspect.booleanAttribute:
                                if (result) {
                                    instance?.setAttribute(target, "");
                                }
                                break;
                            case DOMAspect.property:
                                instance?.setProperty(target, result);
                                break;
                            case DOMAspect.tokenList:
                                instance?.setAttribute("class", result);
                                break;
                        }
                    } else if (factoryRenderer) {
                        yield* factoryRenderer.render(
                            factory,
                            renderInfo,
                            source,
                            this,
                            context
                        );
                    }

                    break;
                }

                case OpType.attributeBindingMarker:
                    if (this.shouldEmitHydrationMarkup(renderInfo)) {
                        yield ` ${hydrationMarker.attribute(code.indexes)}`;
                    }

                    break;

                case OpType.templateElementOpen:
                    yield "<template";
                    for (const [name, value] of code.staticAttributes) {
                        yield ` ${DefaultTemplateRenderer.formatAttribute(name, value)}`;
                    }

                    for (const attr of code.dynamicAttributes) {
                        const renderer = this.getFactoryRenderer(attr.factory);

                        if (renderer) {
                            yield " ";
                            yield* renderer.render(
                                attr.factory,
                                renderInfo,
                                source,
                                this,
                                context
                            );
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

    public getElementRenderer(
        renderInfo: RenderInfo,
        tagName: string,
        ceClass: typeof HTMLElement | undefined = customElements.get(tagName),
        attributes: AttributesMap = new Map()
    ): ElementRenderer {
        if (ceClass) {
            for (const renderer of renderInfo.elementRenderers) {
                if (renderer.matchesClass(ceClass, tagName, attributes)) {
                    return new renderer(tagName, renderInfo);
                }
            }
        }

        const fallbackRenderer = new FallbackRenderer(tagName, renderInfo);
        fallbackRenderer.deferHydration = this.deferHydration(tagName);
        return fallbackRenderer;
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

    private getFactoryRenderer<T extends ViewBehaviorFactory>(
        factory: T
    ): ViewBehaviorFactoryRenderer<T> | null {
        return this.viewBehaviorFactoryRenderers.get(factory.constructor) || null;
    }

    /**
     * Format attribute key/value pair into a HTML attribute string.
     * @param name - the attribute name.
     * @param value - the attribute value.
     */
    private static formatAttribute(name: string, value: string) {
        return value === "" ? name : `${name}="${value}"`;
    }

    public shouldEmitHydrationMarkup(renderInfo: RenderInfo) {
        return (
            this.emitHydratableMarkup && !!renderInfo.customElementInstanceStack.length
        );
    }
}
