import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTPicker } from "../picker.js";
import { MenuPlacement } from "../picker.options.js";

const storyTemplate = html<StoryArgs<FASTPicker>>`
    <fast-picker
        selection="${x => x.selection}"
        options="${x => x.options}"
        disable-selection-filter="${x => x.disableSelectionFilter}"
        disable-query-filter="${x => x.disableQueryFilter}"
        :showLoading="${x => x.showLoading}"
        ?disabled="${x => x.disabled}"
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
    args: {},
    argTypes: {
        queryFilterDisabled: { control: "boolean" },
        disabled: { control: "boolean" },
        disableQueryFilter: { control: "boolean" },
        disableSelectionFilter: { control: "boolean" },
        showLoading: { control: "boolean" },
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
    noSuggestionsText: "No suggestions available",
    options: "apple, orange, banana, mango, strawberry, raspberry, blueberry",
    placeholder: "Choose fruit",
    selection: "apple",
    suggestionsAvailableText: "Found some fruit",
    disabled: false,
};

export const PickerEmpty: Story<FASTPicker> = renderComponent(storyTemplate).bind({});
PickerEmpty.args = {
    label: "Fruit picker",
    loadingText: "Loading",
    noSuggestionsText: "No suggestions available",
    options: "",
    placeholder: "Choose fruit",
    selection: "",
    suggestionsAvailableText: "Found some fruit",
};
