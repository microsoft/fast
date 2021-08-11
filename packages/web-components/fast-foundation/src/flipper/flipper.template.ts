import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type { Flipper, FlipperOptions } from "./flipper";
import { FlipperDirection } from "./flipper.options";

/**
 * The template for the {@link @microsoft/fast-foundation#Flipper} component.
 * @public
 */
export const flipperTemplate: (
    context: ElementDefinitionContext,
    definition: FlipperOptions
) => ViewTemplate<Flipper> = (
    context: ElementDefinitionContext,
    definition: FlipperOptions
) => html`
    <template
        role="button"
        aria-disabled="${x => (x.disabled ? true : void 0)}"
        tabindex="${x => (x.hiddenFromAT ? -1 : 0)}"
        class="${x => x.direction} ${x => (x.disabled ? "disabled" : "")}"
        @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
    >
        ${when(
            x => x.direction === FlipperDirection.next,
            html`
                <span part="next" class="next">
                    <slot name="next">
                        ${definition.next || ""}
                    </slot>
                </span>
            `
        )}
        ${when(
            x => x.direction === FlipperDirection.previous,
            html`
                <span part="previous" class="previous">
                    <slot name="previous">
                        ${definition.previous || ""}
                    </slot>
                </span>
            `
        )}
    </template>
`;
