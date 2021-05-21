import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import BreadcrumbTemplate from "./fixtures/base.html";
import "../breadcrumb-item";
import "./index";
import { ViewTemplate, html } from "@microsoft/fast-element";
import { Breadcrumb as BreadcrumbComponent } from "@microsoft/fast-foundation";

const customSeparatorTemplate: ViewTemplate<HTMLElement> = html`
    <svg
        slot="separator"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.64582 4.14708C7.84073 3.95147 8.15731 3.9509 8.35292 4.14582L13.8374 9.6108C14.0531 9.82574 14.0531 10.1751 13.8374 10.39L8.35292 15.855C8.15731 16.0499 7.84073 16.0493 7.64582 15.8537C7.4509 15.6581 7.45147 15.3415 7.64708 15.1466L12.8117 10.0004L7.64708 4.85418C7.45147 4.65927 7.4509 4.34269 7.64582 4.14708Z"
        />
    </svg>
`;

function addItem(): void {
    const breadcrumbElement = document.getElementById("mybreadcrumb");
    const items = breadcrumbElement?.querySelectorAll("fast-breadcrumb-item");

    if (items !== undefined) {
        const lastItem = items[items.length - 1];
        const item: any = document.createElement("fast-breadcrumb-item");
        item.setAttribute("href", "#");
        item.textContent = `Breadcrumb item ${items.length + 1}`;

        if (lastItem.parentNode !== null) {
            lastItem.parentNode.insertBefore(item, lastItem.nextSibling);
        }
    }
}

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase() === "breadcrumb--breadcrumb") {
        const button = document.getElementById("add-button") as HTMLElement;
        button.addEventListener("click", addItem);

        const customBreadcrumb = document.getElementById("breadcrumbId");
        (customBreadcrumb as BreadcrumbComponent).separatorTemplate = customSeparatorTemplate;
    }
});

export default {
    title: "Breadcrumb",
};

export const Breadcrumb = () => BreadcrumbTemplate;
