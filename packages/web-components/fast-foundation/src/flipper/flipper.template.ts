import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Flipper } from "./flipper";
import { FlipperDirection } from "./flipper.options";

/**
 * The template for the {@link @microsoft/fast-foundation#Flipper} component.
 * @public
 */
export const FlipperTemplate: ViewTemplate<Flipper> = html`
    <template
        role="button"
        aria-disabled="${x => (x.disabled ? true : void 0)}"
        tabindex="${x => (x.hiddenFromAT ? -1 : 0)}"
        class="${x => x.direction} ${x => (x.disabled ? "disabled" : "")}"
    >
        ${when(
            x => x.direction === FlipperDirection.next,
            html`
                <span part="next" class="next">
                    <slot name="next">
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.023 15.273L11.29 8 4.023.727l.704-.704L12.71 8l-7.984 7.977-.704-.704z"
                            />
                        </svg>
                    </slot>
                </span>
            `
        )}
        ${when(
            x => x.direction === FlipperDirection.previous,
            html`
                <span part="previous" class="previous">
                    <slot name="previous">
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.273 15.977L3.29 8 11.273.023l.704.704L4.71 8l7.266 7.273-.704.704z"
                            />
                        </svg>
                    </slot>
                </span>
            `
        )}
    </template>
`;
