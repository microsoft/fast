import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTFlipper, FlipperOptions } from "./flipper.js";
import type { FlipperDirection } from "./flipper.options.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTFlipper} component.
 * @public
 */
export function flipperTemplate<T extends FASTFlipper>(
    options: FlipperOptions = {}
): ElementViewTemplate<T> {
    const templateCache = {};

    function setFlipperTemplateByDirection(
        direction: FlipperDirection,
        options: FlipperOptions
    ) {
        let existing = templateCache[direction];

        if (!existing) {
            templateCache[direction] = existing = html<T>`
                <span part="${direction}" class="${direction}">
                    <slot name="${direction}">
                        ${options[direction] ?? ""}
                    </slot>
                </span>
            `;
        }

        return existing;
    }

    return html<T>`
        <template
            role="button"
            aria-disabled="${x => (x.disabled ? true : void 0)}"
            tabindex="${x => (x.hiddenFromAT ? -1 : 0)}"
            @keyup="${(x, c) => x.keyupHandler(c.event as KeyboardEvent)}"
        >
            ${x => setFlipperTemplateByDirection(x.direction, options)}
        </template>
    `;
}
