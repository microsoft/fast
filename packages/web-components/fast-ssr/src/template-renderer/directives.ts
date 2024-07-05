import { HydrationMarkup } from "@microsoft/fast-element/element-hydration.js";
import {
    ChildrenDirective,
    Constructable,
    DOMAspect,
    ExecutionContext,
    HTMLBindingDirective,
    RefDirective,
    RenderDirective,
    RepeatDirective,
    SlottedDirective,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import { escapeHtml } from "../escape-html.js";
import { RenderInfo } from "../render-info.js";
import { DefaultTemplateRenderer } from "./template-renderer.js";

/**
 * Describes an implementation that can render a directive.
 *
 * @beta
 */
export interface ViewBehaviorFactoryRenderer<T extends ViewBehaviorFactory> {
    /**
     * Renders a ViewBehaviorFactory
     * @param behaviorFactory - The ViewBehaviorFactory instance to render
     * @param renderInfo - The current RenderInfo context
     * @param source - Source data
     * @param renderer - The TemplateRenderer
     * @param context - The ExecutionContext
     */
    render(
        behaviorFactory: T,
        renderInfo: RenderInfo,
        source: any,
        renderer: DefaultTemplateRenderer,
        context: ExecutionContext
    ): IterableIterator<string>;

    /**
     * The behavior constructor to use this renderer for.
     */
    matcher: Constructable<T>;
}

export const RepeatDirectiveRenderer: ViewBehaviorFactoryRenderer<RepeatDirective> =
    Object.freeze({
        matcher: RepeatDirective,
        *render(
            directive: RepeatDirective,
            renderInfo: RenderInfo,
            source: any,
            renderer: DefaultTemplateRenderer,
            context: ExecutionContext
        ): IterableIterator<string> {
            const items = directive.dataBinding.evaluate(source, context);
            const template = directive.templateBinding.evaluate(source, context);
            const childContext = Object.create(context, {
                parent: { value: source },
                parentContext: { value: context },
            });

            const updateChildContext = directive.options.positioning
                ? (index: number, length: number) => {
                      childContext.index = index;
                      childContext.length = length;
                  }
                : noop;

            if (template instanceof ViewTemplate) {
                for (let i = 0, length = items.length; i < length; i++) {
                    updateChildContext(i, length);

                    if (renderer.shouldEmitHydrationMarkup(renderInfo)) {
                        yield `<!--${HydrationMarkup.repeatStartMarker(i)}-->`;
                    }

                    yield* renderer.render(template, renderInfo, items[i], childContext);

                    if (renderer.shouldEmitHydrationMarkup(renderInfo)) {
                        yield `<!--${HydrationMarkup.repeatEndMarker(i)}-->`;
                    }
                }
            } else {
                throw new Error("Unable to render Repeat Directive template");
            }
        },
    });

export const RenderDirectiveRenderer: ViewBehaviorFactoryRenderer<RenderDirective> =
    Object.freeze({
        matcher: RenderDirective,
        *render(
            directive: RenderDirective,
            renderInfo: RenderInfo,
            source: any,
            renderer: DefaultTemplateRenderer,
            context: ExecutionContext
        ): IterableIterator<string> {
            const data = directive.dataBinding.evaluate(source, context);
            const template = directive.templateBinding.evaluate(source, context);
            const childContext = Object.create(context, {
                parent: { value: source },
                parentContext: { value: context },
            });

            if (template instanceof ViewTemplate) {
                yield* renderer.render(template, renderInfo, data, childContext);
            } else {
                throw new Error("Unable to render Render Directive template");
            }
        },
    });

function* noop() {
    yield "";
}

export const ChildrenDirectiveRenderer: ViewBehaviorFactoryRenderer<ChildrenDirective> =
    Object.freeze({
        matcher: ChildrenDirective,
        render: noop,
    });

export const RefDirectiveRenderer: ViewBehaviorFactoryRenderer<RefDirective> =
    Object.freeze({
        matcher: RefDirective,
        render: noop,
    });

export const SlottedDirectiveRenderer: ViewBehaviorFactoryRenderer<SlottedDirective> =
    Object.freeze({
        matcher: SlottedDirective,
        render: noop,
    });

export const HTMLBindingDirectiveRenderer: ViewBehaviorFactoryRenderer<HTMLBindingDirective> =
    Object.freeze({
        matcher: HTMLBindingDirective,
        *render(
            directive: HTMLBindingDirective,
            renderInfo: RenderInfo,
            source: any,
            renderer: DefaultTemplateRenderer,
            context: ExecutionContext
        ): IterableIterator<string> {
            if (directive.aspectType === DOMAspect.event) {
                return;
            }

            const result = directive.dataBinding.evaluate(source, context);

            switch (directive.aspectType) {
                case DOMAspect.attribute:
                    if (result !== null && result !== undefined) {
                        yield `${directive.targetAspect}="${
                            typeof result === "string" ? escapeHtml(result) : result
                        }"`;
                    }

                    break;
                case DOMAspect.booleanAttribute:
                    if (result) {
                        yield directive.targetAspect;
                    }
                    break;
                case DOMAspect.property:
                // Intentional fall-through
                case DOMAspect.tokenList: {
                    const { targetAspect } = directive;
                    if (targetAspect === "classList" || targetAspect === "className") {
                        yield `class="${result}"`;
                    }
                    break;
                }
                case DOMAspect.content:
                    {
                        if (result instanceof ViewTemplate) {
                            yield* renderer.render(result, renderInfo, source, context);
                        } else if (result === null || result === undefined) {
                            yield "";
                        } else if (typeof result === "string") {
                            yield result;
                        } else if (
                            typeof result === "number" ||
                            typeof result === "boolean"
                        ) {
                            yield `${result}`;
                        }
                    }
                    break;
            }
        },
    });

export const defaultViewBehaviorFactoryRenderers: ViewBehaviorFactoryRenderer<any>[] = [
    ChildrenDirectiveRenderer,
    HTMLBindingDirectiveRenderer,
    RefDirectiveRenderer,
    RenderDirectiveRenderer,
    RepeatDirectiveRenderer,
    SlottedDirectiveRenderer,
];
