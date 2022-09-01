import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTPicker } from "../picker.js";
import { MenuPlacement } from "../picker.options.js";

const storyTemplate = html<StoryArgs<FASTPicker>>`
    <fast-picker
        selection="${x => x.selection}"
        options="${x => x.options}"
        ?filter-selected="${x => x.filterSelected}"
        ?filter-query="${x => x.filterQuery}"
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
        // TODO: These are always true https://github.com/microsoft/fast/issues/6311
        filterQuery: true,
        filterSelected: true,
    },
    argTypes: {
        filterQuery: { control: "boolean" },
        filterSelected: { control: "boolean" },
        label: { control: "text" },
        labelledBy: { control: "text" },
        loadingText: { control: "text" },
        maxSelected: { control: "number" },
        menuPlacement: { control: "select", options: Object.values(MenuPlacement) },
        noSuggestionsText: { control: "text" },
        placeholder: { control: "text" },
        suggestionsAvailableText: { control: "text" },
    },
} as Meta<FASTPicker>;

export const Picker: Story<FASTPicker> = renderComponent(storyTemplate).bind({});
Picker.args = {
    label: "Fruit picker",
    loadingText: "Loading",
    noSuggestionsText: "No such fruit",
    options: "apple, orange, banana, mango, strawberry, raspberry, blueberry",
    placeholder: "Choose fruit",
    selection: "apple",
    suggestionsAvailableText: "Found some fruit",
};
