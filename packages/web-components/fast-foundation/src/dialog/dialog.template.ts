import { ElementViewTemplate, html, ref, when } from "@microsoft/fast-element";
import type { FASTDialog } from "./dialog.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTDialog} component.
 * @public
 */
export function dialogTemplate<T extends FASTDialog>(): ElementViewTemplate<T> {
    return html<T>`
        ${when(
            x => x.modal,
            html<T>`
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
            aria-modal="${x => (x.modal ? x.modal : void 0)}"
            aria-describedby="${x => x.ariaDescribedby}"
            aria-labelledby="${x => x.ariaLabelledby}"
            aria-label="${x => x.ariaLabel}"
            ${ref("dialog")}
        >
            <slot></slot>
        </div>
    `;
}
