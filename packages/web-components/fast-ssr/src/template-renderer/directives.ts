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
import { RenderInfo } from "../render-info.js";
import { TemplateRenderer } from "./template-renderer.js";

/**
 * Describes an implementation that can render a directive.
 *
 * @beta
 */
export interface ViewBehaviorFactoryRenderer<T extends ViewBehaviorFactory> {
    /**
     * Renders a ViewBehaviorFactory
     * @param behavior - The behavior to render
     * @param renderInfo - The current RenderInfo context
     * @param source - Source data
     * @param renderer - The current TemplateRenderer
     * @param context - The ExecutionContext
     */
    render(
        behavior: T,
        renderInfo: RenderInfo,
        source: any,
        renderer: TemplateRenderer,
        context: ExecutionContext
    ): IterableIterator<string>;

    /**
     * The behavior constructor to use this renderer for.
     */
    matcher: Constructable<T>;
}

export const RepeatDirectiveRenderer: ViewBehaviorFactoryRenderer<RepeatDirective> = Object.freeze(
    {
        matcher: RepeatDirective,
        *render(
            directive: RepeatDirective,
            renderInfo: RenderInfo,
            source: any,
            renderer: TemplateRenderer,
            context: ExecutionContext
        ): IterableIterator<string> {
            const items = directive.dataBinding(source, context);
            const template = directive.templateBinding(source, context);
            const childContext = context.createChildContext(source);

            if (template instanceof ViewTemplate) {
                if (directive.options.positioning) {
                    for (let i = 0, length = items.length; i < length; i++) {
                        // Match fast-element repeater item context code.
                        const ctx: ExecutionContext = childContext.createItemContext(
                            i,
                            length
                        );
                        yield* renderer.render(template, renderInfo, items[i], ctx);
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
    }
);

function* noop() {
    yield "";
}
export const ChildrenDirectiveRenderer: ViewBehaviorFactoryRenderer<ChildrenDirective> = Object.freeze(
    {
        matcher: ChildrenDirective,
        render: noop,
    }
);

export const RefDirectiveRenderer: ViewBehaviorFactoryRenderer<RefDirective> = Object.freeze(
    {
        matcher: RefDirective,
        render: noop,
    }
);
export const SlottedDirectiveRenderer: ViewBehaviorFactoryRenderer<SlottedDirective> = Object.freeze(
    {
        matcher: SlottedDirective,
        render: noop,
    }
);

export const defaultViewBehaviorFactoryRenderers: ViewBehaviorFactoryRenderer<any>[] = [
    RepeatDirectiveRenderer,
    ChildrenDirectiveRenderer,
    RefDirectiveRenderer,
    SlottedDirectiveRenderer,
];
