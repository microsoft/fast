import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Dialog } from "./dialog";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";

/**
 * The template for the {@link @microsoft/fast-foundation#Dialog} component.
 * @public
 */
export const dialogTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Dialog> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
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
