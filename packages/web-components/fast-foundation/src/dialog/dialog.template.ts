import { html, ref, when } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Dialog } from "./dialog.js";

/**
 * The template for the {@link @ni/fast-foundation#Dialog} component.
 * @public
 */
export const dialogTemplate: FoundationElementTemplate<ViewTemplate<Dialog>> = (
    context,
    definition
) => html`
    <div class="positioning-region" part="positioning-region">
        ${when(
            x => x.modal,
            html<Dialog>`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    @click="${x => x.dismiss()}"
                ></div>
            `
        )}
        <div
            role="dialog"
            tabindex="-1"
            class="control"
            part="control"
            aria-modal="${x => x.modal}"
            aria-describedby="${x => x.ariaDescribedby}"
            aria-labelledby="${x => x.ariaLabelledby}"
            aria-label="${x => x.ariaLabel}"
            ${ref("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;
