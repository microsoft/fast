import { html, ref, when } from "@microsoft/fast-element";
/**
 * The template for the {@link @microsoft/fast-foundation#Dialog} component.
 * @public
 */
export const dialogTemplate = (context, definition) => html`
    <div class="positioning-region" part="positioning-region">
        ${when(
            x => x.modal,
            html`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    tabindex="-1"
                    @click="${x => x.dismiss()}"
                ></div>
            `
        )}
        <div
            role="dialog"
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
