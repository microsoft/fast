import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTPicker } from "../picker.js";

type PickerArgs = Args & FASTPicker;
type PickerMeta = Meta<PickerArgs>;

const storyTemplate = html<PickerArgs>`
    <fast-picker
        selection="${x => x.selection}"
        options="${x => x.options}"
        filter-selected="${x => x.filterSelected}"
        filter-query="${x => x.filterQuery}"
        max-selected="${x => x.maxSelected}"
        no-suggestions-text="${x => x.noSuggestionsText}"
        suggestions-available-text="${x => x.suggestionsAvailableText}"
        loading-text="${x => x.loadingText}"
        label="${x => x.label}"
        labelled-by="${x => x.labelledBy}"
        placeholder="${x => x.placeholder}"
        menu-placement="${x => x.menuPlacement}"
    ></fast-picker>
`;

export default {
    title: "Picker",
    args: {
        selection: "apple",
        options: "apple, orange, banana, mango, strawberry, raspberry, blueberry",
        placeholder: "Choose fruit",
        noSuggestionsText: "No such fruit",
        suggestionsAvailableText: "Found some fruit",
        loadingText: "Loading",
        label: "Fruit picker",
    },
    argTypes: {
        filterSelected: { control: { type: "boolean" } },
        filterQuery: { control: { type: "boolean" } },
        maxSelected: { control: { type: "number" } },
        noSuggestionsText: { control: { type: "text" } },
        suggestionsAvailableText: { control: { type: "text" } },
        loadingText: { control: { type: "text" } },
        label: { control: { type: "text" } },
        labelledBy: { control: { type: "text" } },
        placeholder: { control: { type: "text" } },
        menuPlacement: {
            options: [
                "bottom",
                "bottom-fill",
                "tallest",
                "tallest-fill",
                "top",
                "top-fill",
            ],
            control: { type: "select" },
        },
    },
} as PickerMeta;

export const Picker = (args: PickerArgs) => {
    const storyFragment = new DocumentFragment();
    storyTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
