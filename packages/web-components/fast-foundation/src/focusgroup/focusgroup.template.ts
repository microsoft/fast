import { focusgroup, html, ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { Focusgroup } from "./focusgroup";

export const FocusgroupTemplate: FoundationElementTemplate<ViewTemplate<Focusgroup>> = (
    context,
    definition
) =>
    html`
        <template>
            ${x => html`
                <span
                    ${focusgroup({
                        wrap: x.wrap,
                    })}
                >
                    <slot></slot>
                </span>
            `}
        </template>
    `;
