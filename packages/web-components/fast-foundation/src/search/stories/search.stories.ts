import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { Search as FoundationSearch } from "../search.js";

type SearchStoryArgs = Args & FoundationSearch;
type SearchStoryMeta = Meta<SearchStoryArgs>;

const componentTemplate = html<SearchStoryArgs>`
    <fast-search
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        list="${x => x.list}"
        maxlength="${x => x.maxlength}"
        minlength="${x => x.minlength}"
        pattern="${x => x.pattern}"
        placeholder="${x => x.placeholder}"
        ?readonly="${x => x.readOnly}"
        size="${x => x.size}"
        ?spellcheck="${x => x.spellcheck}"
        value="${x => x.value}"
    >
        ${x => x.label}
    </fast-search>
`;

export default {
    title: "Search",
    args: {
        label: "Search",
    },
    argTypes: {
        autofocus: { control: { type: "boolean" } },
        disabled: { control: { type: "boolean" } },
        label: { control: { type: "text" } },
        list: { control: { type: "text" } },
        maxlength: { control: { type: "number" } },
        minlength: { control: { type: "number" } },
        pattern: { control: { type: "text" } },
        placeholder: { control: { type: "text" } },
        readOnly: { control: { type: "boolean" } },
        size: { control: { type: "number" } },
        spellcheck: { control: { type: "boolean" } },
        value: { control: { type: "text" } },
    },
} as SearchStoryMeta;

export const Search = (args: SearchStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
