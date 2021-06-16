import { customElement } from "@microsoft/fast-element";
import { PeoplePickerStyles as peoplePickerStyles } from "./people-picker.styles";
import { createPeoplePickerTemplate } from "./people-picker.template";
import { PeoplePicker } from "./people-picker";

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
    template: createPeoplePickerTemplate("fast"),
    styles: peoplePickerStyles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTPeoplePicker extends PeoplePicker {}

/**
 * Styles for PeoplePicker
 * @public
 */
export const PeoplePickerStyles = peoplePickerStyles;
