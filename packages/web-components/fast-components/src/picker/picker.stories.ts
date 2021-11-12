import { html, ViewTemplate } from "@microsoft/fast-element";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { Picker } from "@microsoft/fast-foundation";
import PickerTemplate from "./fixtures/picker.html";

const optionContentsTemplate: ViewTemplate = html`
    <div class="div-blue">
        ${x => x.value}
    </div>
`;

const itemContentsTemplate: ViewTemplate = html`
    <div class="div-purple">
        ${x => x.value}
    </div>
`;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("picker")) {
        const customTemplatePicker = document.getElementById(
            "customtemplatepicker"
        ) as Picker;
        customTemplatePicker.menuOptionContentsTemplate = optionContentsTemplate;
        customTemplatePicker.listItemContentsTemplate = itemContentsTemplate;
    }
});

export default {
    title: "Picker",
};

export const picker = () => PickerTemplate;
