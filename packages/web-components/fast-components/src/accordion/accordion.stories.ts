import { html, repeat } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import { renderComponent } from "../storybook-helpers.js";
import type { Accordion } from "./index.js";

const componentTemplate = html<Accordion & Args>`
    <fast-accordion expand-mode="${x => x.expandmode}">
        ${repeat(
            x => x.content,
            html`
                ${x => x}
            `
        )}
    </fast-accordion>
`;

export default {
    title: "Accordion",
    args: {
        content: [
            html`
                <fast-accordion-item>
                    <div slot="start">
                        <button>1</button>
                    </div>
                    <div slot="end">
                        <button>1</button>
                    </div>
                    <span slot="heading">Panel one</span>
                    Panel one content
                </fast-accordion-item>
                <fast-accordion-item>
                    <span slot="heading">Panel two</span>
                    <fast-button tabindex="0">Button</fast-button>
                    <fast-button tabindex="0">Button</fast-button>
                </fast-accordion-item>
                <fast-accordion-item>
                    <span slot="heading">Panel three</span>
                    Panel three content
                </fast-accordion-item>
            `,
        ],
    },
    decorators: [
        Story => {
            const renderedStory = Story() as Accordion;
            const styles = document.createElement("style");
            styles.innerHTML = /* css */ `
                fast-accordion-item.disabled::part(button) {
                    pointer-events: none;
                }
            `;
            renderedStory.prepend(styles);
            return renderedStory;
        },
    ],
} as Meta;

export const Primary = renderComponent(componentTemplate).bind({});

export const SingleExpand = renderComponent(componentTemplate).bind({});
SingleExpand.args = {
    expandmode: "single",
};

export const WithDisabledItems = renderComponent(componentTemplate).bind({});
WithDisabledItems.args = {
    content: [
        html`
            <fast-accordion-item>
                <span slot="heading">Panel One</span>
                Panel one
            </fast-accordion-item>
            <fast-accordion-item class="disabled">
                <span slot="heading">Disabled Panel</span>
                Panel two content
            </fast-accordion-item>
            <fast-accordion-item expanded>
                <span slot="heading">Panel Three</span>
                Panel three
            </fast-accordion-item>
        `,
    ],
};

export const CustomExpandedCollapsedIcons = renderComponent(componentTemplate).bind({});
CustomExpandedCollapsedIcons.args = {
    content: [
        html`
            <fast-accordion-item expanded>
                <span slot="heading">Panel One</span>
                <svg
                    slot="collapsed-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7 14.2037C7 15.0444 7.97434 15.5098 8.62834 14.9816L13.351 11.1671C14.0943 10.5668 14.0943 9.4337 13.351 8.83333L8.62834 5.01887C7.97434 4.49064 7 4.95613 7 5.79681V14.2037Z"
                    />
                </svg>
                <svg
                    slot="expanded-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.79681 7C4.95612 7 4.49064 7.97434 5.01887 8.62834L8.83333 13.351C9.43371 14.0943 10.5668 14.0943 11.1672 13.351L14.9816 8.62834C15.5098 7.97434 15.0444 7 14.2037 7H5.79681Z"
                    />
                </svg>
                Panel one content
            </fast-accordion-item>
        `,
    ],
};
