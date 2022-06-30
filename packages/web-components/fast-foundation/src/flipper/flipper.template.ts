import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
import type { FASTFlipper, FlipperOptions } from "./flipper.js";
import { FlipperDirection } from "./flipper.options.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTFlipper} component.
 * @public
 */
export function flipperTemplate(
    options: FlipperOptions = {}
): ElementViewTemplate<FASTFlipper> {
    return html`
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
                            ${options.next || ""}
                        </slot>
                    </span>
                `
            )}
            ${when(
                x => x.direction === FlipperDirection.previous,
                html`
                    <span part="previous" class="previous">
                        <slot name="previous">
                            ${options.previous || ""}
                        </slot>
                    </span>
                `
            )}
        </template>
    `;
}
