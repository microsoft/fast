import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Calendar } from "./calendar";

/**
 * @public
 */
export const CalendarTemplate: ViewTemplate<Calendar> = html`
    <template>
        <div class="title">${x => x.month} ${x => x.year}</div>
    </template>
`;
