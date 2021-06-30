import { html, ref, ViewTemplate } from "@microsoft/fast-element";
import { Picker } from "@microsoft/fast-foundation";
import type { PeoplePicker } from "./people-picker";

const itemTemplate: ViewTemplate = html`
    <button
        role="listitem"
        tabindex="0"
        @click="${(x, c) => c.parent.handleItemClick(c.event as MouseEvent, c.index)}"
        @keydown="${(x, c) =>
            c.parent.handleItemKeyDown(c.event as KeyboardEvent, c.index)}"
    >
        <mgt-person user-id="${x => x}" view="oneLine"></mgt-person>
    </button>
`;

const optionTemplate: ViewTemplate = html`
    <button
        role="listitem"
        tabindex="-1"
        @click="${(x, c) => c.parent.handleOptionClick(c.event as MouseEvent, x)}"
    >
        <mgt-person
            user-id="${x => x}"
            view="twoLines"
            line2-property="jobTitle"
        ></mgt-person>
    </button>
`;

/**
 * The template for the People Picker component.
 * @public
 */
export const peoplePickerTemplate: (context, definition) => ViewTemplate<PeoplePicker> = (
    context,
    definition
) => {
    const pickerTag = context.tagFor(Picker);
    return html<PeoplePicker>`
        <template>
           <${pickerTag}
                ${ref("picker")}  
                :defaultItemTemplate=${itemTemplate}
                :defaultOptionTemplate=${optionTemplate}
                :optionsList=${x => x.optionsList}
                :showLoading=${x => x.showLoading}
                @menuopening="${(x, c) => x.handleMenuOpening(c.event as Event)}"
           >
           </${pickerTag}>
        </template>
    `;
};
