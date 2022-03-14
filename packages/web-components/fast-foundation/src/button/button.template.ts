import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end";
import type { FoundationElementTemplate } from "../foundation-element";
import type { Button, ButtonOptions } from "./button";
import { reflectAttributes } from "../directives/reflect-attributes";

/**
 * The template for the {@link @microsoft/fast-foundation#(Button:class)} component.
 * @public
 */
export const buttonTemplate: FoundationElementTemplate<
    ViewTemplate<Button>,
    ButtonOptions
> = (context, definition) => html`
    <button
        class="control"
        part="control"
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        ${reflectAttributes(
            "form",
            "formaction",
            "formenctype",
            "formmethod",
            "formnovalidate",
            "formtarget",
            "name",
            "type",
            "value",
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
            "aria-pressed",
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
    </button>
`;
