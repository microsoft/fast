import { html } from "@microsoft/fast-element";
import { when } from "@microsoft/fast-element";
import { ref } from "@microsoft/fast-element";
import { Dialog } from "./dialog";

export const DialogTemplate = html<Dialog>`
    <div class="positioning-region" part="positioning-region">
        ${when(
            x => x.modal,
            html<Dialog>`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    tabindex="-1"
                    @click=${x => x.dismiss()}
                ></div>
            `
        )}
        <div
            role="dialog"
            class="root"
            part="root"
            aria-modal=${x => x.modal}
            aria-describedby=${x => x.ariaDescribedby}
            aria-labelledby=${x => x.ariaLabelledby}
            aria-label=${x => x.ariaLabel}
            ${ref("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`;
