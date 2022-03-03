import { RenderInfo } from "@lit-labs/ssr";
import { Constructable, RepeatDirective } from "@microsoft/fast-element";
import { TemplateRenderer } from "./template-renderer.js";

/**
 * Describes an implementation that can render a directive
 */
export interface DirectiveRenderer<T extends Constructable> {
    render(
        directive: InstanceType<T>,
        renderInfo: RenderInfo,
        source: any,
        renderer: TemplateRenderer
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
            renderer: TemplateRenderer
        ): IterableIterator<string> {
            yield "";
        },
    }
);

export const defaultFASTDirectiveRenderers: DirectiveRenderer<any>[] = [
    RepeatDirectiveRenderer,
];
