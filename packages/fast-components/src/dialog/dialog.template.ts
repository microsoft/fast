import { html } from "@microsoft/fast-element";
import { ref, when } from "@microsoft/fast-element/dist/directives/";
import { Dialog } from "./dialog";

export const DialogTemplate = html<Dialog>`
<div part="root" ?hidden=${x => x.hidden}>
    <div class="positioning-region" part="positioning-region">
        ${when(
            x => x.modal,
            html<Dialog>`
            <div
                class="overlay"
                part="overlay"
                role="presentation"
                tabindex="-1"
                @click=${(x, c) => x.dismiss()}
            ></div>
        `
        )}
        <div
            role="dialog"
            class="content-region"
            part="content-region"
            $aria-modal=${x => x.modal}
            $aria-describedby=${x => x.ariaDescribedby}
            $aria-labelledby=${x => x.ariaLabelledby}
            $aria-label=${x => x.ariaLabel}
            ${ref("dialog")}
        >
            <slot></slot>
        </div>
    </div>
</div>
`;
