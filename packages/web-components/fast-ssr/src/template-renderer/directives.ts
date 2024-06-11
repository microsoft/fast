import {
    ChildrenDirective,
    Constructable,
    ExecutionContext,
    RefDirective,
    RepeatDirective,
    SlottedDirective,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import { RenderDirective } from "@microsoft/fast-element/render.js";
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

            if (template instanceof ViewTemplate) {
                if (directive.options.positioning) {
                    for (let i = 0, length = items.length; i < length; i++) {
                        childContext.index = i;
                        childContext.length = length;
                        yield* renderer.render(
                            template,
                            renderInfo,
                            items[i],
                            childContext
                        );
                    }
                } else {
                    for (let i = 0, length = items.length; i < length; i++) {
                        yield* renderer.render(
                            template,
                            renderInfo,
                            items[i],
                            childContext
                        );
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

export const defaultViewBehaviorFactoryRenderers: ViewBehaviorFactoryRenderer<any>[] = [
    RepeatDirectiveRenderer,
    RenderDirectiveRenderer,
    ChildrenDirectiveRenderer,
    RefDirectiveRenderer,
    SlottedDirectiveRenderer,
];
