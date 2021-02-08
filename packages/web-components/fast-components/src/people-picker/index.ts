import { customElement, html, ViewTemplate } from "@microsoft/fast-element";
import { createListPickerTemplate } from "@microsoft/fast-foundation";
import { PeoplePickerStyles as styles } from "./people-picker.styles";
import { PeoplePicker } from "./people-picker";

function createItemTemplate(): ViewTemplate {
    return html`
        <button role="listitem" tabindex="0">
            ${x => x}
        </button>
    `;
}

function createOptionTemplate(): ViewTemplate {
    return html`
        <button
            role="option"
            tabindex="-1"
            @click="${(x, c) => c.parent.handleOptionClick(c.event as MouseEvent)}"
        >
            ${x => x}
        </button>
    `;
}

/**
 * The FAST People Picker Custom Element. Implements {@link @microsoft/fast-foundation#PeoplePicker},
 * {@link @microsoft/fast-foundation#PeoplePickerTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-people-picker\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
@customElement({
    name: "fast-people-picker",
    template: createListPickerTemplate(
        "fast",
        createItemTemplate(),
        createOptionTemplate()
    ),
    styles,
})
export class FASTPeoplePicker extends PeoplePicker {}

/**
 * Styles for PeoplePicker
 * @public
 */
export const PeoplePickerStyles = styles;
