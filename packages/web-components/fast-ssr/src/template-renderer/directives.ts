import { RenderInfo } from "@lit-labs/ssr";
import {
    ChildrenDirective,
    Constructable,
    ExecutionContext,
    ItemContext,
    RefDirective,
    RepeatDirective,
    SlottedDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
import { TemplateRenderer } from "./template-renderer.js";

/**
 * Describes an implementation that can render a directive
 */
export interface DirectiveRenderer<T extends Constructable> {
    render(
        directive: InstanceType<T>,
        renderInfo: RenderInfo,
        source: any,
        renderer: TemplateRenderer,
        context: ExecutionContext
    ): IterableIterator<string>;
    matcher: T;
}

export const RepeatDirectiveRenderer: DirectiveRenderer<typeof RepeatDirective> = Object.freeze(
    {
        matcher: RepeatDirective,
        *render(
            directive: InstanceType<typeof RepeatDirective>,
            renderInfo: RenderInfo,
            source: any,
            renderer: TemplateRenderer,
            context: ExecutionContext
        ): IterableIterator<string> {
            const items = directive.itemsBinding(source, context);
            const template = directive.templateBinding(source, context);
            const childContext = context.createChildContext(source);

            if (template instanceof ViewTemplate) {
                if (directive.options.positioning) {
                    for (let i = 0, length = items.length; i < length; i++) {
                        // Match fast-element repeater item context code.
                        const ctx: ItemContext = childContext.createItemContext(
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
export const ChildrenDirectiveRenderer: DirectiveRenderer<typeof ChildrenDirective> = Object.freeze(
    {
        matcher: ChildrenDirective,
        render: noop,
    }
);

export const RefDirectiveRenderer: DirectiveRenderer<typeof RefDirective> = Object.freeze(
    {
        matcher: RefDirective,
        render: noop,
    }
);
export const SlottedDirectiveRenderer: DirectiveRenderer<typeof SlottedDirective> = Object.freeze(
    {
        matcher: SlottedDirective,
        render: noop,
    }
);

export const defaultFASTDirectiveRenderers: DirectiveRenderer<any>[] = [
    RepeatDirectiveRenderer,
    ChildrenDirectiveRenderer,
    RefDirectiveRenderer,
    SlottedDirectiveRenderer,
];
