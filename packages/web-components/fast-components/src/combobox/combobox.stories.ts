import { html, repeat } from "@microsoft/fast-element";
import { Combobox, ListboxOption } from "@microsoft/fast-foundation";
import { Args, Meta } from "@storybook/html";
import { renderComponent } from "../storybook-helpers.js";

const componentTemplate = html<Combobox & Args>`
    <fast-combobox
        ?open="${x => x.open}"
        id="${x => x.id}"
        value="${x => x.value}"
        autocomplete="${x => x.autocomplete}"
        ?disabled="${x => x.disabled}"
        position="${x => x.position}"
    >
        ${x => x.indicator}
        ${repeat(
            x => x.options,
            html<ListboxOption>`
                <fast-option ?selected="${x => x.selected}">${x => x.text}</fast-option>
            `
        )}
    </fast-combobox>
`;

export default {
    title: "Combobox",
    args: {
        options: [
            { text: "William Hartnell" },
            { text: "Patrick Troughton" },
            { text: "Jon Pertwee" },
            { text: "Tom Baker" },
            { text: "Peter Davidson" },
            { text: "Colin Baker" },
            { text: "Sylvester McCoy" },
            { text: "Paul McGann" },
            { text: "Christopher Eccleston" },
            { text: "David Tenant" },
            { text: "Matt Smith" },
            { text: "Peter Capaldi" },
            { text: "Jodie Whittaker" },
        ],
    },
    argTypes: {
        open: {
            control: "boolean",
        },
    },
} as Meta<typeof Combobox>;

export const Primary = renderComponent(componentTemplate).bind({});

export const WithNoOptions = renderComponent(componentTemplate).bind({});
WithNoOptions.args = {
    options: [],
};

export const WithOpenAttribute = renderComponent(componentTemplate).bind({});
WithOpenAttribute.args = {
    open: true,
};

const adjacentLabelTemplate = html`
    <label style="display:block" for="combobox-with-adjacent-label">
        Adjacent Label:
    </label>
    ${componentTemplate}
`;

export const WithAdjacentLabel = renderComponent(adjacentLabelTemplate).bind({});
WithAdjacentLabel.args = {
    id: "combobox-with-adjacent-label",
};

const wrappingLabelTemplate = html`
    <label style="display:block" for="combobox-with-wrapping-label">
        <div>Wrapping Label:</div>
        ${componentTemplate}
    </label>
`;

export const WithWrappingLabel = renderComponent(wrappingLabelTemplate).bind({});
WithWrappingLabel.args = {
    id: "combobox-with-wrapping-label",
};

export const WithDefaultSelectedItem = renderComponent(componentTemplate).bind({});
WithDefaultSelectedItem.args = {
    options: [
        { text: "John" },
        { text: "Paul" },
        { text: "George", selected: true },
        { text: "Ringo" },
    ],
};

export const WithInitialValue = renderComponent(componentTemplate).bind({});
WithInitialValue.args = {
    value: "Christopher Eccleston",
};

export const WithInlineAutocomplete = renderComponent(componentTemplate).bind({});
WithInlineAutocomplete.args = {
    autocomplete: "inline",
};

export const WithListAutocomplete = renderComponent(componentTemplate).bind({});
WithListAutocomplete.args = {
    autocomplete: "list",
};

export const WithBothAutocomplete = renderComponent(componentTemplate).bind({});
WithBothAutocomplete.args = {
    autocomplete: "both",
};

export const Disabled = renderComponent(componentTemplate).bind({});
Disabled.args = {
    disabled: true,
};

export const DisabledWithSelectedItem = renderComponent(componentTemplate).bind({});
DisabledWithSelectedItem.args = {
    disabled: true,
    options: [{ text: "This option is not selectable", selected: true }],
};

export const WithForcedPositionAbove = renderComponent(componentTemplate).bind({});
WithForcedPositionAbove.args = {
    position: "above",
};
WithForcedPositionAbove.decorators = [
    Story => {
        const renderedStory = Story() as DocumentFragment;

        // const root = document.getElementById("root");
        const style = document.createElement("style");
        style.innerHTML = /* css */ `
            #root {
                display: flex;
                align-items: end;
                height: 100%;
                box-sizing: border-box;
            }
        `;
        renderedStory.prepend(style);
        return renderedStory;
    },
] as Meta["decorators"];

export const WithForcedPositionBelow = renderComponent(componentTemplate).bind({});
WithForcedPositionBelow.args = {
    position: "below",
};

export const WithCustomIndicator = renderComponent(componentTemplate).bind({});
WithCustomIndicator.args = {
    indicator: html`
        <svg slot="indicator" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.5 7.7h-1v-1h1v1zm4.1 0h-1v-1h1v1zm4.1-1v2.1h-1v2.6l-.1.6-.3.5c-.1.1-.3.3-.5.3l-.6.1H10l-3.5 3v-3H3.9l-.6-.1-.5-.3c-.1-.1-.3-.3-.3-.5l-.1-.6V8.8h-1V6.7h1V5.2l.1-.6.3-.5c.1-.1.3-.3.5-.3l.6-.1h3.6V1.9a.8.8 0 01-.4-.4L7 1V.6l.2-.3.3-.2L8 0l.4.1.3.2.3.3V1l-.1.5-.4.4v1.7h3.6l.6.1.5.3c.1.1.3.3.3.5l.1.6v1.5h1.1zm-2.1-1.5l-.2-.4-.4-.2H3.9l-.4.2-.1.4v6.2l.2.4.4.2h3.6v1.8L9.7 12h2.5l.4-.2.2-.4V5.2zM5.8 8.9l1 .7 1.2.2a5 5 0 001.2-.2l1-.7.7.7c-.4.4-.8.7-1.4.9-.5.2-1 .3-1.6.3s-1.1-.1-1.6-.3A3 3 0 015 9.6l.8-.7z"
            />
        </svg>
    `,
};

export const WithVeryLongList = renderComponent(componentTemplate).bind({});
WithVeryLongList.args = {
    options: [
        { text: "Alabama" },
        { text: "Alaska" },
        { text: "Arizona" },
        { text: "Arkansas" },
        { text: "California" },
        { text: "Colorado" },
        { text: "Connecticut" },
        { text: "Delaware" },
        { text: "Florida" },
        { text: "Georgia" },
        { text: "Hawaii" },
        { text: "Idaho" },
        { text: "Illinois" },
        { text: "Indiana" },
        { text: "Iowa" },
        { text: "Kansas" },
        { text: "Kentucky" },
        { text: "Louisiana" },
        { text: "Maine" },
        { text: "Maryland" },
        { text: "Massachusetts" },
        { text: "Michigan" },
        { text: "Minnesota" },
        { text: "Mississippi" },
        { text: "Missouri" },
        { text: "Montana" },
        { text: "Nebraska" },
        { text: "Nevada" },
        { text: "New Hampshire" },
        { text: "New Jersey" },
        { text: "New Mexico" },
        { text: "New York" },
        { text: "North Carolina" },
        { text: "North Dakota" },
        { text: "Ohio" },
        { text: "Oklahoma" },
        { text: "Oregon" },
        { text: "Pennsylvania" },
        { text: "Rhode Island" },
        { text: "South Carolina" },
        { text: "South Dakota" },
        { text: "Texas" },
        { text: "Tennessee" },
        { text: "Utah" },
        { text: "Vermont" },
        { text: "Virginia" },
        { text: "Washington" },
        { text: "Wisconsin" },
        { text: "West Virginia" },
        { text: "Wyoming" },
    ],
};
