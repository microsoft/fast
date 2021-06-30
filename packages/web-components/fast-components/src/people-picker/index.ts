import { peoplePickerStyles } from "./people-picker.styles";
import { peoplePickerTemplate } from "./people-picker.template";
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
export const fastPeoplePicker = PeoplePicker.compose({
    baseName: "people-picker",
    template: peoplePickerTemplate,
    styles: peoplePickerStyles,
    shadowOptions: null
});

/**
 * Styles for PeoplePicker
 * @public
 */
export const PeoplePickerStyles = peoplePickerStyles;
