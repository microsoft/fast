import { html, when } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Flipper, FlipperOptions } from "./flipper.js";
import { FlipperDirection } from "./flipper.options.js";

/**
 * The template for the {@link @ni/fast-foundation#Flipper} component.
 * @public
 */
export const flipperTemplate: FoundationElementTemplate<
    ViewTemplate<Flipper>,
    FlipperOptions
> = (context, definition) => html`
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
