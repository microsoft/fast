import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { Anchor } from "./anchor";

/**
 * The template for the {@link @microsoft/fast-foundation#(Anchor:class)} component.
 * @public
 */
export const AnchorTemplate = html<Anchor>`
    <a
        class="control"
        part="control"
        download="${x => x.download}"
        href="${x => x.href}"
        hreflang="${x => x.hreflang}"
        ping="${x => x.ping}"
        referrerpolicy="${x => x.referrerpolicy}"
        rel="${x => x.rel}"
        target="${x => x.target}"
        type="${x => x.type}"
        ariaAtomic="${x => x.ariaAtomic}"
        ariaBusy="${x => x.ariaBusy}"
        ariaControls="${x => x.ariaControls}"
        ariaCurrent="${x => x.ariaCurrent}"
        ariaDescribedBy="${x => x.ariaDescribedby}"
        ariaDetails="${x => x.ariaDetails}"
        ariaDisabled="${x => x.ariaDisabled}"
        ariaErrormessage="${x => x.ariaErrormessage}"
        ariaExpanded="${x => x.ariaExpanded}"
        ariaFlowto="${x => x.ariaDisabled}"
        ariaHaspopup="${x => x.ariaHaspopup}"
        ariaHidden="${x => x.ariaHidden}"
        ariaInvalid="${x => x.ariaInvalid}"
        ariaKeyshortcuts="${x => x.ariaKeyshortcuts}"
        ariaLabel="${x => x.ariaLabel}"
        ariaLabelledby="${x => x.ariaLabelledby}"
        ariaLive="${x => x.ariaLive}"
        ariaOwns="${x => x.ariaOwns}"
        ariaRelevant="${x => x.ariaRelevant}"
        ariaRoledescription="${x => x.ariaRoledescription}"
    >
        ${startTemplate}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endTemplate}
    </a>
`;
