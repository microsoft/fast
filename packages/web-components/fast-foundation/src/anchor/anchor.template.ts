import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end";
import type { FoundationElementTemplate } from "../foundation-element";
import type { Anchor, AnchorOptions } from "./anchor";
import { reflectAttributes } from "../directives/reflect-attributes";

/**
 * The template for the {@link @microsoft/fast-foundation#(Anchor:class)} component.
 * @public
 */
export const anchorTemplate: FoundationElementTemplate<
    ViewTemplate<Anchor>,
    AnchorOptions
> = (context, definition) => html`
    <a
        class="control"
        part="control"
        ${reflectAttributes(
            "download",
            "href",
            "hreflang",
            "ping",
            "referrerpolicy",
            "rel",
            "target",
            "type",
            "aria-atomic",
            "aria-busy",
            "aria-controls",
            "aria-current",
            "aria-describedby",
            "aria-details",
            "aria-disabled",
            "aria-errormessage",
            "aria-expanded",
            "aria-flowto",
            "aria-haspopup",
            "aria-hidden",
            "aria-invalid",
            "aria-keyshortcuts",
            "aria-label",
            "aria-labelledby",
            "aria-live",
            "aria-owns",
            "aria-relevant",
            "aria-roledescription"
        )}
        ${ref("control")}
    >
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot ${slotted("defaultSlottedContent")}></slot>
        </span>
        ${endSlotTemplate(context, definition)}
    </a>
`;
