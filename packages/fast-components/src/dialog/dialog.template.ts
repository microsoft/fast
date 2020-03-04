import { html } from "@microsoft/fast-element";
import { ref, when } from "@microsoft/fast-element/dist/directives/";
import { Dialog } from "./dialog";

// or when the document gets a esc key clicked
export const DialogTemplate = html<Dialog>`
<div part="root" hidden=${x => x.hidden} ${ref("root")}>
    <div class="positioning-region" part="positioning-region">
        ${when(
            x => x.modal,
            html<Dialog>`
            <div
                class="overlay"
                part="overlay"
                role="presentation"
                @click=${(x, c) => x.dismiss()}
            ></div>
        `
        )}
        <div
            role="dialog"
            class="content-region"
            part="content-region"
            aria-modal=${x => x.modal}
            tabindex="-1"
            aria-describedby=${x => x.ariaDescribedby}
            aria-labelledby=${x => x.ariaLabelledby}
            aria-label=${x => x.ariaLabel}
        >
            <slot></slot>
        </div>
    </div>
</div>
`;
