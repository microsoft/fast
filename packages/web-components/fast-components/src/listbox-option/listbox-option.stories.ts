import { addons } from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import Examples from "./fixtures/base.html";
import type { ListboxOption as ListboxOptionType } from "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("listbox-option")) {
        const checkedOption = document.getElementById(
            "checked-option"
        ) as ListboxOptionType;
        checkedOption.checked = true;

        const selectedOption = document.getElementById(
            "selected-option"
        ) as ListboxOptionType;
        selectedOption.selected = true;

        const checkedSelectedOption = document.getElementById(
            "checked-selected-option"
        ) as ListboxOptionType;
        checkedSelectedOption.selected = true;
        checkedSelectedOption.checked = true;
    }
});

export default {
    title: "Listbox Option",
};

export const ListboxOption = () => Examples;
