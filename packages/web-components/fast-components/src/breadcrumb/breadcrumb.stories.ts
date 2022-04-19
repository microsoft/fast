import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import BreadcrumbTemplate from "./fixtures/base.html";

function addItem(): void {
    const breadcrumbElement = document.getElementById("mybreadcrumb");
    const items = breadcrumbElement?.querySelectorAll("fast-breadcrumb-item");

    if (items !== undefined) {
        const item: any = document.createElement("fast-breadcrumb-item");
        item.setAttribute("href", "#");
        item.textContent = `Breadcrumb item ${items.length + 1}`;

        breadcrumbElement?.appendChild(item);
    }
}

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase() === "breadcrumb--breadcrumb") {
        const button = document.getElementById("add-button") as HTMLElement;
        button.addEventListener("click", () => addItem());
    }
});

export default {
    title: "Breadcrumb",
};

export const Breadcrumb = () => BreadcrumbTemplate;
