import { html, ref, ViewTemplate } from "@microsoft/fast-element";
import { Picker } from "@microsoft/fast-foundation";
import type { PeoplePicker } from "./people-picker";

const itemTemplate: ViewTemplate = html`
    <div
        role="listitem"
        tabindex="0"
        @click="${(x, c) => c.parent.handleItemClick(c.event as MouseEvent, c.index)}"
        @keydown="${(x, c) =>
            c.parent.handleItemKeyDown(c.event as KeyboardEvent, c.index)}"
    >
        <mgt-person user-id="${x => x}" view="oneLine"></mgt-person>
    </div>
`;

const optionTemplate: ViewTemplate = html`
    <div
        role="listitem"
        tabindex="-1"
        @click="${(x, c) => c.parent.handleOptionClick(c.event as MouseEvent, x)}"
    >
        <mgt-person
            user-id="${x => x}"
            view="twoLines"
            line2-property="jobTitle"
        ></mgt-person>
    </div>
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
                selection=${x => x.selection}
                no-suggestions-text=${x => x.noSuggestionsText}
                suggestions-available-text=${x => x.suggestionsAvailableText}
                loading-text=${x => x.loadingText}
                @menuopening="${(x, c) => x.handleMenuOpening(c.event as Event)}"
                @menuclosing="${(x, c) => x.handleMenuClosing(c.event as Event)}"
                @selectionchange="${(x, c) =>
                    x.onPickerSelectionChange(c.event as Event)}"
                @querychange="${(x, c) => x.onPickerQueryChange(c.event as Event)}"
           >
           </${pickerTag}>
        </template>
    `;
};
